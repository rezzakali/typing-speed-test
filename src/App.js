import randomWords from "random-words";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const NUMB_OF_WORDS = 200;
const SECONDS = 60;

function App() {
  const [words, setWords] = useState([]);
  const [count, setCount] = useState(SECONDS);
  const [currentInputIndex, setCurrentInputIndex] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const focusToInput = useRef(null);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(-1);
  const [currentCharacter, setCurrentCharacter] = useState("");

  useEffect(() => {
    setWords(generateWords());
  }, []);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  }

  const countStart = () => {
    if (status === "finished") {
      setWords(generateWords());
      setCurrentWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrentCharacterIndex(-1);
      setCurrentCharacter("");
    }
    if (status !== "started") {
      setStatus("started");
      const timer = setInterval(() => {
        setCount((prevState) => {
          if (prevState === 0) {
            clearInterval(timer);
            setStatus("finished");
            setCurrentInputIndex("");
            return SECONDS;
          } else {
            return prevState - 1;
          }
        });
      }, 1000);
    }
  };
  useEffect(() => {
    if (status === "started") {
      focusToInput.current.focus();
    }
  }, [status]);

  const handleKeyDown = ({ keyCode, key }) => {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrentInputIndex("");
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrentCharacterIndex(-1);
    }
    // backspace
    else if (keyCode === 8) {
      setCurrentCharacterIndex(currentCharacterIndex + 1);
      setCurrentCharacter("");
    } else {
      setCurrentCharacterIndex(currentCharacterIndex + 1);
      setCurrentCharacter(key);
    }
  };

  function checkMatch() {
    const compareToWord = words[currentWordIndex];
    const DoesIsMatch = compareToWord === currentInputIndex.trim();
    if (DoesIsMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  const getCharacterClass = (currWordIndex, currCharIndex, currChar) => {
    if (
      currWordIndex === currentWordIndex &&
      currCharIndex === currentCharacterIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (currChar === currentCharacter) {
        return "bg-primary";
      } else {
        return "bg-danger";
      }
    } else if (
      currWordIndex === currentWordIndex &&
      currCharIndex >= words[currentWordIndex].length
    ) {
      return "bg-danger";
    } else {
      return "";
    }
  };
  return (
    <div className="App mt-4">
      <h1>One Minute Typing</h1>
      <hr />

      <ul>
        <li>{count} Seconds</li>
        {status === "finished" && (
          <>
            <li>WPM: {correct} </li>
            <li>
              Accuracy: {Math.round(correct / (correct + incorrect)) * 100} %{" "}
            </li>
          </>
        )}
      </ul>

      <br />
      {status === "started" && (
        <div className="span shadow-lg">
          {words.map((word, index) => (
            <span key={index}>
              <span>
                {word.split("").map((char, i) => (
                  <span key={i} className={getCharacterClass(index, i, char)}>
                    {char}
                  </span>
                ))}
              </span>
              <span> </span>
            </span>
          ))}
        </div>
      )}
      <div className="inputAndButtonArea">
        {" "}
        <br /> <br />
        <input
          ref={focusToInput}
          disabled={status !== "started"}
          type="text"
          className="form-control"
          placeholder="type here"
          onKeyDown={handleKeyDown}
          value={currentInputIndex}
          onChange={(e) => setCurrentInputIndex(e.target.value)}
        />{" "}
        <br />
        <button className="btn btn-primary" onClick={countStart}>
          start
        </button>
      </div>
    </div>
  );
}

export default App;
