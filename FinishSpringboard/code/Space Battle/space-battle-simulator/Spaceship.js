import React, { useState } from "react";

export default function SpaceBattle({
  playerMinDamage = 5,
  playerMaxDamage = 20,
  enemyMinDamage = 5,
  enemyMaxDamage = 20
}) {
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [gameStatus, setGameStatus] = useState("active"); 
  // "active", "win", "lose", "draw"

  const getRandomDamage = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const handleFire = () => {
    if (gameStatus !== "active") return;

    const playerDamage = getRandomDamage(playerMinDamage, playerMaxDamage);
    const enemyDamage = getRandomDamage(enemyMinDamage, enemyMaxDamage);

    const newPlayerHealth = Math.max(playerHealth - enemyDamage, 0);
    const newEnemyHealth = Math.max(enemyHealth - playerDamage, 0);

    setPlayerHealth(newPlayerHealth);
    setEnemyHealth(newEnemyHealth);

    // Determine game outcome
    if (newPlayerHealth <= 0 && newEnemyHealth <= 0) {
      setGameStatus("draw");
    } else if (newEnemyHealth <= 0) {
      setGameStatus("win");
    } else if (newPlayerHealth <= 0) {
      setGameStatus("lose");
    }
  };

  const handleRestart = () => {
    setPlayerHealth(100);
    setEnemyHealth(100);
    setGameStatus("active");
  };

  const renderStatusMessage = () => {
    if (gameStatus === "win") return "🎉 Victory! You destroyed the enemy ship!";
    if (gameStatus === "lose") return "💀 Defeat... Your ship has been obliterated.";
    if (gameStatus === "draw") return "🤝 It's a draw! Both ships were destroyed.";
    return null;
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>🚀 Space Battle Simulator</h1>

      <div style={{ marginBottom: "20px" }}>
        <p>🛸 Player Health: {playerHealth}</p>
        <p>👾 Enemy Health: {enemyHealth}</p>
      </div>

      {gameStatus === "active" ? (
        <button onClick={handleFire} style={{ padding: "10px 20px", fontSize: "18px" }}>
          Fire ☄️
        </button>
      ) : (
        <>
          <h2>{renderStatusMessage()}</h2>
          <button onClick={handleRestart} style={{ padding: "10px 20px", fontSize: "18px" }}>
            Restart 🔄
          </button>
        </>
      )}
    </div>
  );
}
