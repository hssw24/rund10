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

  const updateHighScore = (newHighScore) => {
    setHighScore(newHighScore);
    localStorage.setItem("highScoreTens", JSON.stringify(newHighScore));
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
        <Result highScore={highScore} onRestart={() => setShowGame(true)} onResetHighScore={resetHighScore} />
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

  const handleAnswer = (answer) => {
    const lowerTen = Math.floor(currentNumber / 10) * 10;
    const upperTen = lowerTen + 10;
    const correctAnswer = currentNumber % 10 < 5 ? lowerTen : upperTen;

    if (answer === correctAnswer) {
      setCorrectCount((prev) => prev + 1);
      nextQuestion();
    } else {
      setMistakeCount((prev) => prev + 1);
      setIsWrongAnswer(true);
      setTimeout(() => setIsWrongAnswer(false), 2000);
    }
  };

  const nextQuestion = () => {
    if (questionNumber === 25) {
      onGameOver();
    } else {
      setQuestionNumber((prev) => prev + 1);
      setCurrentNumber(generateRandomNumber());
    }
  };

  const lowerTen = Math.floor(currentNumber / 10) * 10;
  const upperTen = lowerTen + 10;

  return (
    <div style={{ ...styles.gameContainer, backgroundColor: isWrongAnswer ? "#FFCCCC" : "white" }}>
      <h2 style={styles.subTitle}>Frage {questionNumber}/25</h2>
      <h3 style={styles.question}>Welche Zehnerzahl liegt näher an {currentNumber}?</h3>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => handleAnswer(lowerTen)}>{lowerTen}</button>
        <button style={styles.button} onClick={() => handleAnswer(upperTen)}>{upperTen}</button>
      </div>
    </div>
  );
};

const Result = ({ highScore, onRestart, onResetHighScore }) => {
  return (
    <div>
      <h2 style={styles.subTitle}>Spiel beendet!</h2>
      <h3 style={styles.question}>Ergebnisse</h3>
      <p style={styles.resultText}>
        Richtige Antworten: {highScore.score} <br />
        Fehler: {highScore.totalMistakes} <br />
        Highscore: {highScore.name || "—"} ({highScore.time === Infinity ? "—" : highScore.time.toFixed(2) + " Sekunden"})
      </p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={onRestart}>Neues Spiel starten</button>
        <button style={styles.resetButton} onClick={onResetHighScore}>Highscore zurücksetzen</button>
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", padding: "20px", fontFamily: "Arial, sans-serif" },
  title: { fontSize: "24px", marginBottom: "20px" },
  subTitle: { fontSize: "20px", marginBottom: "10px" },
  question: { fontSize: "18px", marginBottom: "20px" },
  gameContainer: { transition: "background-color 0.5s", padding: "20px", borderRadius: "8px" },
  buttonContainer: { display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" },
  button: { padding: "15px 20px", fontSize: "16px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "100px" },
  resetButton: { padding: "15px 20px", fontSize: "16px", backgroundColor: "#FF5733", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", minWidth: "100px" },
  resultText: { fontSize: "16px", marginBottom: "20px" },
};

export default App;
