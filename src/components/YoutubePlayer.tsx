import React, {
  useRef,
  FunctionComponent,
  useEffect,
  useCallback
} from "react";
import IframeApi from "./IframeApi";

type YoutubePlayerProps = {
  videoId: string;
  height: string;
  width: string;
  className?: string;
  onStatusChange?: (status: string) => void;
  onPercentageChange?: (percent: number) => void;
};

export const YoutubePlayer: FunctionComponent<YoutubePlayerProps> = props => {
  const watchedTime = useRef<any[]>([]);
  const prevPercent = useRef<number>(0);
  const playerInstance = useRef<any>();
  const container = useRef<HTMLDivElement | null>();
  const timer = useRef<any>();

  const onPlayerStateChange = useCallback(
    (event: any) => {
      const State = window.YT.PlayerState; // eslint-disable-line no-undef
      let status = "INITIAL";

      switch (event.data) {
        case State.CUED:
          status = "VIDEO CUED";
          break;
        case State.BUFFERING:
          status = "VIDEO BUFFERING";
          break;
        case State.PAUSED:
          status = "VIDEO PAUSED";
          break;
        case State.PLAYING:
          status = "VIDEO PLAYING";
          break;
        case State.ENDED:
          status = "VIDEO ENDED";
          break;
        default:
      }

      props.onStatusChange && props.onStatusChange(status);

      if (event.data === State.PLAYING) {
        if (!watchedTime.current.length) {
          watchedTime.current = new Array(
            parseInt(playerInstance.current.getDuration())
          );
        }

        timer.current = setInterval(function () {
          watchedTime.current[
            parseInt(playerInstance.current.getCurrentTime())
          ] = true;

          var percent = 0;
          for (var i = 0, l = watchedTime.current.length; i < l; i++) {
            if (watchedTime.current[i]) percent++;
          }
          percent = Math.round((percent / watchedTime.current.length) * 100);

          if (percent !== prevPercent.current) {
            prevPercent.current = percent;

            props.onPercentageChange && props.onPercentageChange(percent);
          }
        }, 100);
        return;
      }

      if (timer) {
        clearInterval(timer.current);
      }
    },
    [props]
  );

  const createPlayer = useCallback(() => {
    IframeApi().then((YT: any) => {
      const { width, height, videoId } = props;

      playerInstance.current = new YT.Player(container.current, {
        height,
        width,
        videoId
      });

      playerInstance.current.addEventListener("onStateChange", (event: any) => {
        onPlayerStateChange(event);
      });
    });
  }, [onPlayerStateChange, props]);

  useEffect(() => {
    createPlayer();

    return () => {
      if (playerInstance) {
        playerInstance.current.destroy();
      }
    };
  }, [props.videoId, createPlayer]);

  return (
    <div
      className={props.className}
      ref={(instance: HTMLDivElement | null) => {
        container.current = instance;
      }}
    ></div>
  );
};
