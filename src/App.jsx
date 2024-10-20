import { useEffect, useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  let [result, setResult] = useState(0);
  const input = useRef([]);

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    try {
      const response = await fetch("https://the-trivia-api.com/v2/questions");
      const data = await response.json();
      console.log(data);
      setQuestions(data);
      setError(false);
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  const next = () => {
    const SelectedOption = input.current.find((item) => item && item.checked);
    if (!SelectedOption) {
      alert("Please select an answer before proceeding!");
      return;
    }
    
    setSelectedAnswer(SelectedOption.value);

    if (SelectedOption.value === questions[currentIndex].correctAnswer) {
      setResult(result + 1);
    }

    if (currentIndex < questions.length - 1) {
      setcurrentIndex(currentIndex + 1);
      setSelectedAnswer("");
    }
  };

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="quiz-title">Quiz App</h1>
        <div className="score-display">
          Score: {result} / {questions.length}
        </div>
      </header>
      
      {loading && <p className="loading-message">Loading...</p>}
      {error && <p className="error-message">Error in Loading Questions!</p>}

      {!loading && questions.length > 0 && (
        <div className="quiz-section">
          <h2 className="question">
            Q{currentIndex + 1}: {questions[currentIndex].question.text}
          </h2>

          <div className="options-container">
            {shuffleArray([
              ...questions[currentIndex].incorrectAnswers,
              questions[currentIndex].correctAnswer,
            ]).map((item, index) => {
              return (
                <div key={`option${index}`} className="option-item">
                  <input
                    type="radio"
                    name="answer"
                    value={item}
                    id={`option${index}`}
                    ref={(el) => (input.current[index] = el)}
                    className="option-input"
                  />
                  <label htmlFor={`option${index}`} className="option-label">
                    {item}
                  </label>
                </div>
              );
            })}
          </div>
          <button className="next-btn" onClick={next}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
