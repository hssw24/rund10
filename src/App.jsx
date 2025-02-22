import React, { useState, useEffect } from "react";

const App = () => {
  const [highScore, setHighScore] = useState(
    JSON.parse(localStorage.getItem("highScoreTens")) || {
      name: "",
      score: 0,
      time: Infinity,
      totalRounds: 0,
      totalMistakes: 0,
    }
  );
  const [showGame, setShowGame] = useState(true);
  const [lastResult, setLastResult] = useState(null);

  const updateHighScore = (newHighScore) => {
    if (newHighScore.score > highScore.score || (newHighScore.score === highScore.score && newHighScore.time < highScore.time)) {
      const playerName = prompt("Neuer Highscore! Bitte Namen eingeben:");
      if (playerName) {
        newHighScore.name = playerName;
        setHighScore(newHighScore);
        localStorage.setItem("highScoreTens", JSON.stringify(newHighScore));
      }
    }
    setLastResult(newHighScore);
  };

  const resetHighScore = () => {
    setHighScore({ name: "", score: 0, time: Infinity, totalRounds: 0, totalMistakes: 0 });
    localStorage.removeItem("highScoreTens");
    alert("Highscore wurde zurückgesetzt.");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcher Zehner liegt näher?</h1>
      {showGame ? (
        <Game highScore={highScore} updateHighScore={updateHighScore} onGameOver={() => setShowGame(false)} />
      ) : (
        <Result highScore={highScore} lastResult={lastResult} onRestart={() => setShowGame(true)} onResetHighScore={resetHighScore} />
      )}
    </div>
  );
};

const Game = ({ highScore, updateHighScore, onGameOver }) => {
  const [number, setNumber] = useState(generateRandomNumber());
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const handleChoice = (choice) => {
    const correctChoice = number % 10 < 5 ? Math.floor(number / 10) * 10 : Math.ceil(number / 10) * 10;
    if (choice === correctChoice) {
      setScore(score + 1);
    } else {
      setMistakes(mistakes + 1);
    }
    if (score + mistakes + 1 === 25) {
      const timeTaken = (Date.now() - startTime) / 1000;
      updateHighScore({ score, totalMistakes: mistakes, time: timeTaken, totalRounds: 25 });
      onGameOver();
    } else {
      setNumber(generateRandomNumber());
    }
  };

  return (
    <div>
      <p>Zahl: {number}</p>
      <button onClick={() => handleChoice(Math.floor(number / 10) * 10)}> {Math.floor(number / 10) * 10} </button>
      <button onClick={() => handleChoice(Math.ceil(number / 10) * 10)}> {Math.ceil(number / 10) * 10} </button>
    </div>
  );
};

const generateRandomNumber = () => Math.floor(Math.random() * 1000);

const Result = ({ highScore, lastResult, onRestart, onResetHighScore }) => (
  <div style={styles.resultContainer}>
    <h2>Spiel beendet!</h2>
    <p>Spielername: {lastResult?.name || "-"}</p>
    <p>Richtige Antworten: {lastResult?.score || 0}</p>
    <p>Fehlversuche: {lastResult?.totalMistakes || 0}</p>
    <p>Benötigte Zeit: {lastResult?.time.toFixed(2)} Sekunden</p>
    <p>Gesamt gespielte Runden: {lastResult?.totalRounds || 0}</p>
    <button style={styles.button} onClick={onRestart}>Neues Spiel</button>
    <button style={styles.resetButton} onClick={onResetHighScore}>Highscore zurücksetzen</button>
  </div>
);

const styles = {
  container: { textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif", backgroundColor: "#FFFFFF", color: "#000000" },
  title: { fontSize: "22px", marginBottom: "20px" },
  resultContainer: { textAlign: "center", padding: "20px", backgroundColor: "#F8F9FA", borderRadius: "8px" },
  button: { padding: "12px 15px", fontSize: "14px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "90px" },
  resetButton: { padding: "12px 15px", fontSize: "14px", backgroundColor: "#FF5733", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "90px" },
};

export default App;
