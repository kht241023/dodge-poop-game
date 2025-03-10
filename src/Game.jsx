import GameUI from "./GameUI";
import React, { useState, useEffect, useRef } from "react";
import "./Game.css";

const Game = () => {
  const gameWidth = 400;
  const gameHeight = 600;
  const playerWidth = 40;
  const poopSize = 30;
  const moveStep = 20;

  const [playerPosition, setPlayerPosition] = useState(180);
  const [poops, setPoops] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const gameAreaRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    let interval;

    if (gameActive) {
      setScore(0);
      setPoops(
        Array.from({ length: 5 }).map(() => ({
          x: Math.floor(Math.random() * (gameWidth - poopSize)),
          y: 0,
        }))
      );

      interval = setInterval(() => {
        setPoops((prevPoops) =>
          prevPoops.map((poop) => {
            let newY = poop.y + 10;
            if (newY > gameHeight) {
              return { x: Math.random() * (gameWidth - poopSize), y: 0 };
            }
            return { ...poop, y: newY };
          })
        );
        setScore((prev) => prev + 1);
      }, 100);
    }

    return () => clearInterval(interval);
  }, [gameActive]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!gameActive) {
        if (event.key === "Enter" || event.key === " ") {
          startGame();
        }
        return;
      }

      if (event.key === "ArrowLeft" && playerPosition > 0) {
        setPlayerPosition((prev) => Math.max(0, prev - moveStep));
      } else if (
        event.key === "ArrowRight" &&
        playerPosition < gameWidth - playerWidth
      ) {
        setPlayerPosition((prev) =>
          Math.min(gameWidth - playerWidth, prev + moveStep)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameActive, playerPosition]);

  useEffect(() => {
    if (!gameActive || !playerRef.current || !gameAreaRef.current) return;

    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    const playerRect = playerRef.current.getBoundingClientRect();

    for (const poop of poops) {
      const poopRect = {
        left: gameAreaRect.left + poop.x,
        right: gameAreaRect.left + poop.x + poopSize,
        top: gameAreaRect.top + poop.y,
        bottom: gameAreaRect.top + poop.y + poopSize,
      };

      if (
        playerRect.left < poopRect.right &&
        playerRect.right > poopRect.left &&
        playerRect.top < poopRect.bottom &&
        playerRect.bottom > poopRect.top
      ) {
        endGame();
        return;
      }
    }
  }, [poops]);

  const startGame = () => {
    setGameActive(true);
    setShowModal(false);
  };

  const endGame = () => {
    setGameActive(false);
    setShowModal(true);
  };

  return (
    <GameUI
      gameAreaRef={gameAreaRef}
      playerRef={playerRef}
      poops={poops}
      playerPosition={playerPosition}
      score={score}
      gameActive={gameActive}
      startGame={startGame}
      showModal={showModal}
      setShowModal={setShowModal}
    />
  );
};

export default Game;
