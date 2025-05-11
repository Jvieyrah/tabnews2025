import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";

function Clock() {
  const [secondsAngle, setSecondsAngle] = useState(0);
  const [minutesAngle, setMinutesAngle] = useState(0);
  const [hoursAngle, setHoursAngle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      setHoursAngle(
        (newTime.getHours() % 12) * 30 + newTime.getMinutes() * 0.5,
      );
      setMinutesAngle(newTime.getMinutes() * 6 + newTime.getSeconds() * 0.1);
      setSecondsAngle(newTime.getSeconds() * 6);
    }, 1000);

    return () => clearInterval(timer); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div className={styles.clockContainer}>
      <div className={styles.clockFace}>
        <div
          className={styles.hourPointer}
          style={{ transform: `rotate(${hoursAngle}deg)` }}
        />
        <div
          className={styles.minutePointer}
          style={{ transform: `rotate(${minutesAngle}deg)` }}
        />
        <div
          className={styles.secondPointer}
          style={{ transform: `rotate(${secondsAngle}deg)` }}
        />
      </div>
    </div>
  );
}

export default Clock;
