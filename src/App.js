import React from "react";
import Deck from "./components/deck";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Yugioh Hypergeometric calculator</p>
      </header>
      <div className="App-body">
        <Deck />
      </div>
    </div>
  );
}

export default App;
