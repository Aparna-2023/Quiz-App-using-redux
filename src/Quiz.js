// src/components/Quiz.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { answerQuestion, nextQuestion, resetQuiz, tick } from './store/quizSlice';

const Quiz = () => {
  const dispatch = useDispatch();
  const { questions, currentQuestionIndex, score, quizCompleted, timeLeft, totalQuestions, answered, selectedAnswer } = useSelector(
    (state) => state.quiz
  );

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!quizCompleted && !answered) {
      const timer = setInterval(() => {
        if (timeLeft > 0) {
          dispatch(tick());
        } else {
          handleAnswerClick(''); // Automatically submit an empty answer if time runs out
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, quizCompleted, answered, dispatch]);

  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const handleAnswerClick = (answer) => {
    if (!answered) {
      dispatch(answerQuestion({ answer, timeTaken: 10 - timeLeft }));
    }
  };

  const handleNextQuestion = () => {
    dispatch(nextQuestion());
  };

  const handleResetClick = () => {
    dispatch(resetQuiz());
  };

  return (
    <div className="quiz-container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: '600px', width: '100%' }}>
        {quizCompleted ? (
          <div className="text-center">
            <h2 className="card-title text-success">Quiz Completed!</h2>
            <p className="card-text fs-4">Your Score: <strong>{score}</strong></p>
            <button className="btn btn-primary mt-4" onClick={handleResetClick}>
              Restart Quiz
            </button>
          </div>
        ) : (
          <>
            <h2 className="card-title text-center">{currentQuestion.question}</h2>
            <p className="text-center text-danger">Time Left: {timeLeft}s</p>
            <div className="progress mb-4">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progressPercentage}%` }}
                aria-valuenow={progressPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <div className="list-group mt-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  className={`list-group-item list-group-item-action 
                    ${answered && option === currentQuestion.correctAnswer ? 'list-group-item-success bg-success' : ''} 
                    ${answered && option === selectedAnswer && option !== currentQuestion.correctAnswer ? 'list-group-item-danger' : ''}`}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answered} // Disable buttons after answering
                >
                  {option}
                </button>
              ))}
            </div>
            {answered && (
              <div className="mt-4 text-center">
                <button className="btn btn-primary" onClick={handleNextQuestion}>
                  Next Question
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
