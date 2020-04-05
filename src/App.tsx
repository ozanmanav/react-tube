import React from "react";
import "./App.css";
import { YoutubePlayer } from "./components/YoutubePlayer";

function App() {
  const onPercentageChange = (percent: number) => {
    if (percent > 25 && percent < 50) {
      console.log("Watched %25");
    }
    if (percent > 50 && percent < 75) {
      console.log("Watched %50");
    }
    if (percent > 75 && percent < 100) {
      console.log("Watched %75");
    }
  };

  const onStatusChange = (status: string) => {
    console.log(status);
  };

  return (
    <div className="App">
      <header className="App-header">
        <YoutubePlayer
          videoId={"bMcZ5T1nf78"}
          width="800"
          height="600"
          onPercentageChange={onPercentageChange}
          onStatusChange={onStatusChange}
        />
      </header>
    </div>
  );
}

export default App;
