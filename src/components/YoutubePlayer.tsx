import React, {
  useRef,
  FunctionComponent,
  useEffect,
  useCallback
} from "react";
import IframeApi from "./IframeApi";

type YoutubePlayerProps = {
  videoId: string;
  className?: string;
  onStateChange?: (event: any, player: any, percentage: number) => void;
};

export const YoutubePlayer: FunctionComponent<YoutubePlayerProps> = props => {
  const watchedTime = useRef<any[]>([]);
  const prevPercent = useRef<number>(0);
  const player = useRef<Promise<any>>();
  const resolvePlayer = useRef<Function>();
  const playerInstance = useRef<any>();
  const container = useRef<HTMLDivElement | null>();
  const timer = useRef<any>();

  const onPlayerStateChange = useCallback((event: any, player: any) => {
    const State = window.YT.PlayerState; // eslint-disable-line no-undef

    switch (event.data) {
      case State.CUED:
        console.log("VIDEO CUED");
        break;
      case State.BUFFERING:
        console.log("VIDEO BUFFERING");
        break;
      case State.PAUSED:
        console.log("VIDEO PAUSED");
        break;
      case State.PLAYING:
        console.log("VIDEO PLAYING");
        break;
      case State.ENDED:
        console.log("VIDEO ENDED");
        break;
      default:
    }

    if (event.data === State.PLAYING) {
      if (!watchedTime.current.length) {
        watchedTime.current = new Array(parseInt(player.getDuration()));
      }

      timer.current = setInterval(function () {
        watchedTime.current[parseInt(player.getCurrentTime())] = true;

        var percent = 0;
        for (var i = 0, l = watchedTime.current.length; i < l; i++) {
          if (watchedTime.current[i]) percent++;
        }
        percent = Math.round((percent / watchedTime.current.length) * 100);

        if (percent !== prevPercent.current) {
          prevPercent.current = percent;

          if (percent > 25 && percent < 50) {
            console.log("Watched %25");
          }
          if (percent > 50 && percent < 75) {
            console.log("Watched %50");
          }
          if (percent > 75 && percent < 100) {
            console.log("Watched %75");
          }
        }
      }, 100);
      return;
    }

    if (timer) {
      clearInterval(timer.current);
    }
  }, []);

  const createPlayer = useCallback(() => {
    player.current = IframeApi().then(
      (YT: any) =>
        new Promise(resolve => {
          resolvePlayer.current = resolve;

          const player = new YT.Player(container.current, {
            height: "600",
            width: "800",
            videoId: props.videoId
          });

          playerInstance.current = player;

          player.addEventListener("onStateChange", (event: any) => {
            onPlayerStateChange(event, player);
          });
        })
    );
  }, [onPlayerStateChange, props.videoId]);

  useEffect(() => {
    createPlayer();

    return () => {
      if (playerInstance) {
        playerInstance.current.destroy();
      }
    };
  }, [props.videoId, createPlayer]);

  const refContainer = (instance: HTMLDivElement | null) => {
    container.current = instance;
  };

  const { className } = props;

  return <div className={className} ref={refContainer}></div>;
};
