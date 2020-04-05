function loadSdk() {
  return new Promise(resolve => {
    if (
      typeof window.YT === "object" &&
      typeof window.YT.ready === "function"
    ) {
      window.YT.ready(() => {
        resolve(window.YT);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);

    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  });
}

let sdk: Promise<any> | null = null;
export default function getSdk() {
  if (!sdk) {
    sdk = loadSdk();
  }
  return sdk;
}
