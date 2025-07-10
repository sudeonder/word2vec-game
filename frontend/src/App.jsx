import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// adjust URL/port if needed
const socket = io("http://localhost:8000");

export default function App() {
  const [word, setWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(false);

  useEffect(() => {
    socket.on("round_start", ({ word, duration }) => {
      setWord(word);
      setTimeLeft(duration);
      setScore(0);
      setGameActive(true);
    });

    socket.on("score_update", ({ score }) => setScore(score));
    socket.on("round_end", () => setGameActive(false));

    return () => socket.off();
  }, []);

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (gameActive && timeLeft === 0) {
      socket.emit("end_round");
    }
  }, [timeLeft, gameActive]);

  const startGame = () => socket.emit("start_round");
  const submitGuess = () => {
    if (!guess.trim()) return;
    socket.emit("make_guess", { guess: guess.trim() });
    setGuess("");
  };

  return (
    <div className=" w-full h-full bg-gray-50 flex items-center justify-center">
      {!gameActive ? (
        // Make this full-width up to a max, then center
        <div className="w-full space-y-4 text-center mx-auto">
          <h1 className="text-3xl font-bold">Word Guess Game</h1>
          <button
            onClick={startGame}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start
          </button>
          {score > 0 && <p className="text-lg">Last score: {score}</p>}
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4 mx-auto">
          <div className="flex justify-between text-xl">
            <span>
              Word: <strong>{word}</strong>
            </span>
            <span>Time: {timeLeft}s</span>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitGuess()}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Type similar word…"
            />
            <button
              onClick={submitGuess}
              className="px-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Guess
            </button>
          </div>
          <p className="text-right text-lg">Score: {score}</p>
        </div>
      )}
    </div>
  );
}
