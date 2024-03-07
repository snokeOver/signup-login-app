import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../../redux/userSlice";
import "./CountdownTimer.css"; // Import your CSS file

const CountdownTimer = () => {
  const dispatch = useDispatch();
  const { timer, count } = useSelector((state) => state.user);
  let currCount = parseInt(localStorage.getItem("countdownTime"));

  const [clockTimer, setClockTimer] = useState(currCount || timer);

  useEffect(() => {
    // Save the initial countdown time to localStorage
    localStorage.setItem("countdownTime", clockTimer);

    const interval = setInterval(() => {
      setClockTimer((prevTimer) => {
        const newTimer = prevTimer > 0 ? prevTimer - 1 : 0;

        // Save the updated countdown time to localStorage
        localStorage.setItem("countdownTime", newTimer);

        return newTimer;
      });
    }, 1000);
    if (count > 0 && clockTimer === 0) {
      dispatch(userActions.resetCount());
    }

    return () => clearInterval(interval);
  }, [clockTimer]);

  const hours = Math.floor(clockTimer / 3600);
  const minutes = Math.floor((clockTimer % 3600) / 60);
  const seconds = clockTimer % 60;

  return (
    <div className="flex flex-col  items-center gap-2">
      <div className="wall-clock ">
        <div
          className="hand minute-hand"
          style={{
            transform: `translate(-50%, -100%) rotate(${
              (60 - minutes) * 6
            }deg)`,
          }}
        ></div>
        <div
          className="hand second-hand"
          style={{
            transform: `translate(-50%, -100%) rotate(${
              (60 - seconds) * 6
            }deg)`,
          }}
        ></div>
      </div>
      <p>Countdown: {formatTime(clockTimer)}</p>
    </div>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedMinutes}:${formattedSeconds}`;
};

export default CountdownTimer;
