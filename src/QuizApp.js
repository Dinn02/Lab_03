import React, { useEffect, useRef, useState, useCallback } from "react";
import "./index.css";
import { Score } from "./Score";

const QuizApp = () => {
    const [index, setIndex] = useState(0);
    const [question, setQuestion] = useState(Score[index]);
    const [lock, setLock] = useState(false);
    const [score, setScore] = useState(0);
    const [result, setResult] = useState(false);
    const [playerName, setPlayerName] = useState("");
    const [playerScores, setPlayerScores] = useState([]);
    const [showNameInput, setShowNameInput] = useState(true);
    const [timeLeft, setTimeLeft] = useState(10); // Thời gian đếm ngược 30 giây

    useEffect(() => {
        const savedScores = JSON.parse(localStorage.getItem("playerScores"));
        if (savedScores) {
            setPlayerScores(savedScores);
        }
    }, []);

    const next = useCallback((auto = false) => {
        if (lock || auto) {
            if (index === Score.length - 1) {
                setResult(true);
                saveScore();
                return;
            }
            setIndex((prevIndex) => prevIndex + 1);
            setQuestion(Score[index + 1]);
            setLock(false);
            option_arr.forEach((option) => {
                option.current.classList.remove("correct");
                option.current.classList.remove("wrong");
            });
        }
    }, [lock, index, Score]);

    useEffect(() => {
        if (!result && !showNameInput) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime === 1) {
                        next(true); // Gọi next khi hết thời gian
                        return 10; // Reset lại thời gian khi chuyển sang câu hỏi mới
                    }
                    return prevTime - 1;
                });
            }, 1000); // Đếm ngược mỗi giây

            // Dọn dẹp interval khi component bị hủy bỏ hoặc index thay đổi
            return () => clearInterval(timer);
        }
    }, [index, result, showNameInput, next]);

    useEffect(() => {
        // Reset thời gian đếm ngược khi câu hỏi thay đổi
        setTimeLeft(10);
    }, [index]);

    const Option1 = useRef(null);
    const Option2 = useRef(null);
    const Option3 = useRef(null);
    const Option4 = useRef(null);

    const option_arr = [Option1, Option2, Option3, Option4];

    const checkAns = (e, ans) => {
        if (lock) return; // Nếu đã chọn đáp án đúng, không cho chọn lại
        if (question.ans === ans) {
            e.target.classList.add("correct");
            setLock(true);
            setScore((prev) => prev + 1);
        } else {
            e.target.classList.add("wrong");
            setLock(true);
            option_arr[question.ans - 1].current.classList.add("correct");
        }
    };

    const reset = () => {
        setPlayerName("");
        setIndex(0);
        setQuestion(Score[0]);
        setScore(0);
        setLock(false);
        setResult(false);
        setShowNameInput(true);
        setTimeLeft(10);
    };

    const saveScore = () => {
        const newScore = { name: playerName, score: score };
        const updatedScores = [...playerScores, newScore];
        setPlayerScores(updatedScores);
        localStorage.setItem("playerScores", JSON.stringify(updatedScores));
    };
    const clearScores = () => {
        setPlayerScores([]);
        localStorage.removeItem("playerScores");
    };

    const handleNameChange = (e) => {
        setPlayerName(e.target.value);
    };

    const startQuiz = () => {
        setShowNameInput(false);
    };

    return (
        <div className="container" id="bodyy">


            {showNameInput && (
                <div className="card" id="box" class="box1">
                    <h2 id="txt">Enter Your Name</h2>
                    <input type="text" value={playerName} onChange={handleNameChange} id="input" required="" />
                    <button onClick={startQuiz}>Start Quiz</button>

                </div>
            )}
            {!showNameInput && (
                <>
                    {result ? (
                        <>
                            <h2>Your Score</h2>
                            <div id="question">
                                <h2 className="text">Total Questions:  {Score.length}</h2>
                                <h3 className="text">Correct Answers:  {score}</h3>
                                <h3 className="text">Wrong Answers: {Score.length - score}</h3>
                            </div>

                            <button onClick={reset}>Play again</button>

                        </>
                    ) : (
                        <>
                            <div className="time">
                                You have {timeLeft} seconds left
                            </div>

                            <h2>{index + 1}. {question.question}</h2>
                            <ul>
                                <li
                                    ref={Option1}
                                    onClick={(e) => {
                                        checkAns(e, 1);
                                    }}
                                >
                                    {question.option1}
                                </li>
                                <li
                                    ref={Option2}
                                    onClick={(e) => {
                                        checkAns(e, 2);
                                    }}
                                >
                                    {question.option2}
                                </li>
                                <li
                                    ref={Option3}
                                    onClick={(e) => {
                                        checkAns(e, 3);
                                    }}
                                >
                                    {question.option3}
                                </li>
                                <li
                                    ref={Option4}
                                    onClick={(e) => {
                                        checkAns(e, 4);
                                    }}
                                >
                                    {question.option4}
                                </li>
                            </ul>

                            <button onClick={() => next(false)}>Next</button>
                            <div className="index">
                                {index + 1} of {Score.length} questions
                            </div>
                        </>
                    )}
                    {result && (
                        <div id="result">
                            <h2 id="clearscore">Player Scores <button onClick={clearScores} id="clear">CLear score</button> </h2>
                            <div className="centerr">
                                <table id="table" border="solid 1px" width="400" className="tb">
                                    <thead>
                                        <tr>
                                            <th width="50">#</th>
                                            <th width="100">Name</th>
                                            <th width="50">Score</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tbody">
                                        {playerScores.map((player, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{player.name}</td>
                                                <td>{player.score}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                    )}
                </>

            )}
        </div>
    );
};

export default QuizApp;
