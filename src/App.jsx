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
  const generateRandomNumber = () => Math.floor(Math.random() * 1001);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [currentNumber, setCurrentNumber] = useState(generateRandomNumber());
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);
  const [startTime] = useState(Date.now());

  const handleAnswer = (answer) => {
    const lowerTen = Math.floor(currentNumber / 10) * 10;
    const upperTen = lowerTen + 10;
    const correctAnswer = currentNumber % 10 < 5 ? lowerTen : upperTen;

    if (answer === correctAnswer) {
      setCorrectCount((prev) => prev + 1);
    } else {
      setMistakeCount((prev) => prev + 1);
      setIsWrongAnswer(true);
      setTimeout(() => setIsWrongAnswer(false), 2000);
      return;
    }
    nextQuestion();
  };

  const nextQuestion = () => {
    if (questionNumber === 25) {
      const endTime = Date.now();
      const elapsedTime = (endTime - startTime) / 1000;
      updateHighScore({ score: correctCount + 1, time: elapsedTime, totalRounds: 25, totalMistakes: mistakeCount });
      onGameOver(false);
    } else {
      setQuestionNumber((prev) => prev + 1);
      setCurrentNumber(generateRandomNumber());
    }
  };

  const lowerTen = Math.floor(currentNumber / 10) * 10;
  const upperTen = lowerTen + 10;

  return (
    <div style={{ ...styles.gameContainer, backgroundColor: isWrongAnswer ? "#FFCCCC" : "#FFFFFF", color: "#000000" }}>
      <h2 style={styles.subTitle}>Frage {questionNumber}/25</h2>
      <h3 style={styles.question}>Welche Zehnerzahl liegt näher an {currentNumber}?</h3>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleAnswer(lowerTen)}>{lowerTen}</button>
        <button style={styles.button} onClick={() => handleAnswer(upperTen)}>{upperTen}</button>
      </div>
    </div>
  );
};

const Result = ({ highScore, lastResult, onRestart, onResetHighScore }) => (
  <div style={styles.resultContainer}>
    <h2>Spiel beendet!</h2>
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
  subTitle: { fontSize: "18px", marginBottom: "10px" },
  question: { fontSize: "16px", marginBottom: "20px" },
  gameContainer: { transition: "background-color 0.5s", padding: "15px", borderRadius: "8px" },
  buttonContainer: { display: "flex", justifyContent: "center", gap: "8px", flexWrap: "wrap" },
  button: { padding: "12px 15px", fontSize: "14px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "90px" },
  resetButton: { padding: "12px 15px", fontSize: "14px", backgroundColor: "#FF5733", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "90px" },
  resultContainer: { textAlign: "center", padding: "20px", backgroundColor: "#F8F9FA", borderRadius: "8px" },
};

export default App;
