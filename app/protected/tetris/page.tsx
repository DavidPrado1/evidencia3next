'use client';

import { useState, useEffect } from 'react';
import { FaHandRock, FaHandPaper, FaHandScissors } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RockPaperScissors = () => {
  const choices = ['piedra', 'papel', 'tijera'];
  const [playerChoice, setPlayerChoice] = useState('');
  const [computerChoice, setComputerChoice] = useState('');
  const [result, setResult] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [counter, setCounter] = useState(5);
  const [animationVisible, setAnimationVisible] = useState(true);
  const [showOptions, setShowOptions] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (waiting && counter > 0) {
      timer = setTimeout(() => {
        setCounter(counter - 1);
      }, 1000);
    } else if (counter === 0 && waiting) {
      const computer = choices[Math.floor(Math.random() * 3)];
      setComputerChoice(computer);
      if (playerChoice === computer) {
        setResult('Empate');
      } else if (
        (playerChoice === 'piedra' && computer === 'tijera') ||
        (playerChoice === 'papel' && computer === 'piedra') ||
        (playerChoice === 'tijera' && computer === 'papel')
      ) {
        setResult('¡Ganaste!');
      } else {
        setResult('Perdiste');
      }
      setWaiting(false);
      setTimeout(() => {
        setAnimationVisible(false);
        setCounter(5);
        setPlayerChoice('');
        setComputerChoice('');
        setResult('');
        setShowOptions(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [waiting, counter]);

  const playGame = (choice: 'piedra' | 'papel' | 'tijera') => {
    setPlayerChoice(choice);
    setWaiting(true);
    setAnimationVisible(true);
    setShowOptions(false);
    setResult('');
    setComputerChoice('');
    setCounter(5);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center px-4">
      <h1 className="text-3xl font-semibold mb-8 text-gray-800">Piedra, Papel o Tijera</h1>

      {waiting && (
        <motion.div
          key={counter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold mb-4 text-gray-800"
        >
          {counter}
        </motion.div>
      )}

      {showOptions && !waiting && (
        <div className="flex space-x-6 mb-8">
          <button
            className="p-4 bg-white rounded-lg shadow-lg hover:scale-110 transform transition duration-300"
            onClick={() => playGame('piedra')}
          >
            <FaHandRock size={80} className="text-gray-800" />
            <p className="mt-2 text-lg">Piedra</p>
          </button>

          <button
            className="p-4 bg-white rounded-lg shadow-lg hover:scale-110 transform transition duration-300"
            onClick={() => playGame('papel')}
          >
            <FaHandPaper size={80} className="text-gray-800" />
            <p className="mt-2 text-lg">Papel</p>
          </button>

          <button
            className="p-4 bg-white rounded-lg shadow-lg hover:scale-110 transform transition duration-300"
            onClick={() => playGame('tijera')}
          >
            <FaHandScissors size={80} className="text-gray-800" />
            <p className="mt-2 text-lg">Tijera</p>
          </button>
        </div>
      )}

      <div className="mt-8">
        {animationVisible && playerChoice && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800">Tu elección:</h3>
            <div className="flex justify-center items-center">
              {playerChoice === 'piedra' && <FaHandRock size={80} className="text-gray-800" />}
              {playerChoice === 'papel' && <FaHandPaper size={80} className="text-gray-800" />}
              {playerChoice === 'tijera' && <FaHandScissors size={80} className="text-gray-800" />}
            </div>
          </motion.div>
        )}

        {animationVisible && computerChoice && (
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800">Elección de la computadora:</h3>
            <div className="flex justify-center items-center">
              {computerChoice === 'piedra' && <FaHandRock size={80} className="text-gray-800" />}
              {computerChoice === 'papel' && <FaHandPaper size={80} className="text-gray-800" />}
              {computerChoice === 'tijera' && <FaHandScissors size={80} className="text-gray-800" />}
            </div>
          </motion.div>
        )}
      </div>

      {result && (
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-gray-800">Resultado:</h2>
          <p className="text-xl font-medium text-gray-700">{result}</p>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
