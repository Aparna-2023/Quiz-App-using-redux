
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  questions: [
    {
      question: "What color is the sky on a clear day?",
      options: ["Blue", "Green", "Red", "Yellow"],
      correctAnswer: "Blue",
    },
    {
      question: "How many legs does a spider have?",
      options: ["Six", "Eight", "Ten", "Four"],
      correctAnswer: "Eight",
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "4",
    },
    {
      question: "Which animal is known as the King of the Jungle?",
      options: ["Elephant", "Tiger", "Lion", "Giraffe"],
      correctAnswer: "Lion",
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Earth", "Mars", "Venus", "Mercury"],
      correctAnswer: "Mercury",
    },
    {
      question:
        "What fruit is known for being red and having seeds on the outside?",
      options: ["Banana", "Strawberry", "Apple", "Orange"],
      correctAnswer: "Strawberry",
    },
    {
      question: "What do bees make?",
      options: ["Milk", "Silk", "Honey", "Bread"],
      correctAnswer: "Honey",
    },
    {
      question: "How many days are in a week?",
      options: ["5", "6", "7", "8"],
      correctAnswer: "7",
    },
    {
      question: "What is the first letter of the alphabet?",
      options: ["B", "C", "A", "D"],
      correctAnswer: "A",
    },
    {
      question: "Which season comes after winter?",
      options: ["Spring", "Summer", "Autumn", "Fall"],
      correctAnswer: "Spring",
    },
  ],

  currentQuestionIndex: 0,
  score: 0,
  quizCompleted: false,
  timeLeft: 10,
  totalQuestions: 10, // Track total number of questions
  quizHistory: [], // Store completed quiz details
  startTime: null, // Track quiz start time
  answered: false, // New state to track if the question has been answered
  selectedAnswer: '', // Store the user's selected answer
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.quizCompleted = false;
      state.totalQuestions = state.questions.length;
      state.timeLeft = 10;
      state.startTime = new Date(); // Capture quiz start time
      state.answered = false; // Reset answer state
      state.selectedAnswer = ''; // Reset selected answer
    },
    answerQuestion: (state, action) => {
      const { answer, timeTaken } = action.payload;
      const currentQuestion = state.questions[state.currentQuestionIndex];

      state.selectedAnswer = answer; // Store selected answer
      state.answered = true; // Mark question as answered

      if (answer === currentQuestion.correctAnswer) {
        const bonus = Math.max(0, state.timeLeft - timeTaken);
        state.score += 10 + bonus;
      }
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex++;
        state.answered = false; // Reset answer state
        state.selectedAnswer = ''; // Reset selected answer
        state.timeLeft = 10; // Reset timer
      } else {
        state.quizCompleted = true;
        const endTime = new Date();
        const timeTaken = (endTime - state.startTime) / 1000; // Time taken in seconds

        // Add quiz result to history
        state.quizHistory.push({
          score: state.score,
          timeTaken: timeTaken,
          date: endTime.toLocaleDateString(),
        });
      }
    },
    resetQuiz: (state) => {
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.quizCompleted = false;
      state.timeLeft = 10;
      state.answered = false; // Reset answer state
      state.selectedAnswer = ''; // Reset selected answer
    },
    tick: (state) => {
      state.timeLeft--;
    },
  },
});

export const { startQuiz, answerQuestion, nextQuestion, resetQuiz, tick } = quizSlice.actions;

export default quizSlice.reducer;