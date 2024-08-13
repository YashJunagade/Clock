import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Container } from "react-bootstrap";
import {
  ArrowRepeat,
  CaretRight,
  PauseFill,
  ArrowUp,
  ArrowDown,
} from "react-bootstrap-icons";
import "./App.css";

export default function App() {
  const [displayTime, setDisplayTime] = useState(1500);
  const [breakTime, setBreakTime] = useState(5);
  const [sessionTime, setSessionTime] = useState(25);
  const [timerOn, setTimerOn] = useState(false);
  const [timerId, setTimerId] = useState("Session");
  const audioElement = useRef(null);
  let loop = undefined;

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
  };

  const changeTime = (amount, type) => {
    let newCount;
    if (type === "Session") {
      newCount = sessionTime + amount;
    } else {
      newCount = breakTime + amount;
    }

    if (newCount > 0 && newCount <= 60 && !timerOn) {
      type === "Session" ? setSessionTime(newCount) : setBreakTime(newCount);
      if (type === "Session") {
        setDisplayTime(newCount * 60);
      }
    }
  };

  const setActive = () => {
    setTimerOn(!timerOn);
  };

  useEffect(() => {
    if (timerOn && displayTime > 0) {
      const interval = setInterval(() => {
        setDisplayTime(displayTime - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (displayTime === 0) {
      audioElement.current.play();
      audioElement.current.currentTime = 0;

      //    setTimeout(() => {
      if (timerId === "Session") {
        setDisplayTime(breakTime * 60);
        setTimerId("Break");
      }
      if (timerId === "Break") {
        setDisplayTime(sessionTime * 60);
        setTimerId("Session");
      }
    }
  }, [breakTime, sessionTime, displayTime, timerId, timerOn]);

  const resetTime = () => {
    setBreakTime(5);
    setSessionTime(25);
    setDisplayTime(1500);
    setTimerId("Session");
    setTimerOn(false);
    clearInterval(loop);
    audioElement.current.load();
  };

  return (
    <Container className="App">
      <h1 className=" mb-5 mt-5">Pomodoro Clock</h1>
      <div className="d-flex">
        <Card style={{ width: "20rem" }} className="mr-2" id="session-label">
          <Card.Header style={{ fontSize: 40 }}>Session Length</Card.Header>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 40px 100px",
              }}
            >
              <Button
                variant="outline-primary"
                className="mx-4"
                id="session-increment"
                onClick={() => changeTime(1, "Session")}
              >
                <ArrowUp color="royalblue" size={20} />
              </Button>
              <Card.Text
                style={{ fontSize: 30 }}
                className="mb-2 text-muted"
                id="session-length"
              >
                {sessionTime}
              </Card.Text>
              <Button
                variant="outline-primary"
                className="mx-4"
                id="session-decrement"
                onClick={() => changeTime(-1, "Session")}
              >
                <ArrowDown color="royalblue" size={20} />
              </Button>
            </div>
          </Card.Body>
        </Card>
        <Card style={{ width: "20rem" }} className="mr-2" id="break-label">
          <Card.Header style={{ fontSize: 40 }}>Break Length</Card.Header>
          <Card.Body
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 40px 100px",
              }}
            >
              <Button
                variant="outline-primary"
                className="mx-4"
                id="break-increment"
                onClick={() => changeTime(1, "Break")}
              >
                <ArrowUp color="royalblue" size={20} />
              </Button>
              <Card.Text
                style={{ fontSize: 30 }}
                className="mb-2 text-muted"
                id="break-length"
              >
                {`${breakTime}`}
              </Card.Text>
              <Button
                variant="outline-primary"
                className="mx-4"
                id="break-decrement"
                onClick={() => changeTime(-1, "Break")}
              >
                <ArrowDown color="royalblue" size={20} />
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
      <Card style={{ width: "18rem" }} className="mt-4">
        <Card.Body>
          <h2 id="timer-label">{timerId}</h2>
          <Card.Title style={{ fontSize: 48 }} id="time-left">
            {formatTime(displayTime)}
          </Card.Title>
          <Button
            variant="outline-primary"
            className="mx-2"
            id="start_stop"
            onClick={setActive}
          >
            {timerOn ? (
              <PauseFill color="royalblue" size={28} />
            ) : (
              <CaretRight color="royalblue" size={28} />
            )}
          </Button>
          <Button
            variant="outline-primary"
            className="mx-2"
            id="reset"
            onClick={resetTime}
          >
            <ArrowRepeat color="royalblue" size={28} />
          </Button>
          <audio
            id="beep"
            type="audio/mpeg"
            src="./Alarm.mp3"
            ref={audioElement}
          />
        </Card.Body>
      </Card>
    </Container>
  );
}

// const setTimerStatus = () => {
//   if (timerOn) {
//     clearTimeout(loop);
//     setTimerOn(false);
//   } else {
//     setTimerOn(true);
//   }
//   const secsRemaining = displayTime
//     ? displayTime
//     : timerId === "Session"
//     ? sessionTime
//     : breakTime;
//   return setDisplayTime(secsRemaining);
// };

// componentWillUnmount() {
//   clearInterval(this.loop);
// }

// useEffect(() => {
//   if (!timerOn) return;
//   loop = setTimeout(() => {
//     if (displayTime !== 0) {
//       return setDisplayTime(displayTime - 1);
//     } else {
//       return [
//         audioElement.current.play(),
//         timerId === "Session"
//           ? [setTimerId("Break"), setDisplayTime(breakTime * 60)]
//           : [setTimerId("Session"), setDisplayTime(sessionTime * 60)]
//         // setTimerId(timerId === "Session" ? "Break" : "Session"),
//         // setDisplayTime(
//         //   timerId === "Session" ? breakTime * 60 : sessionTime * 60
//         // )
//       ];
//     }

//     // if (timerId === "Session") {
//     //   return [
//     //     setDisplayTime(breakTime * 60),
//     //     setTimerId("Break"),
//     //     audioElement.current.play()
//     //   ];
//     // }
//     // if (timerId === "Break") {
//     //   return [
//     //     setDisplayTime(sessionTime * 60),
//     //     setTimerId("Session"),
//     //     audioElement.current.play()
//     //   ];
//     // }
//   }, 100);
// }, [timerOn, displayTime, timerId, breakTime, sessionTime]);
