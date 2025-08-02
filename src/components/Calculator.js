import React, { useState, useEffect } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState([]);
  const [isScientific, setIsScientific] = useState(false);
  const [memory, setMemory] = useState(0);
  const [currentTheme, setCurrentTheme] = useState('purple');
  const [answerColor, setAnswerColor] = useState('normal');

  const themes = {
    purple: {
      name: 'Purple',
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #667eea, #764ba2)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    ocean: {
      name: 'Ocean',
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #667eea, #764ba2)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    sunset: {
      name: 'Sunset',
      primary: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      secondary: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    forest: {
      name: 'Forest',
      primary: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      secondary: 'linear-gradient(135deg, #56ab2f, #a8e6cf)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    midnight: {
      name: 'Midnight',
      primary: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      secondary: 'linear-gradient(135deg, #2c3e50, #34495e)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    coral: {
      name: 'Coral',
      primary: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 50%, #fad0c4 100%)',
      secondary: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    aurora: {
      name: 'Aurora',
      primary: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      secondary: 'linear-gradient(135deg, #a8edea, #fed6e3)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    },
    fire: {
      name: 'Fire',
      primary: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
      secondary: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
      accent: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
      success: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
    }
  };

  const getAnswerColor = (value) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) {
      return 'error';
    }
    
    if (numValue === 0) {
      return 'zero';
    } else if (numValue > 0) {
      return 'positive';
    } else if (numValue < 0) {
      return 'negative';
    } else if (numValue === Infinity || numValue === -Infinity) {
      return 'infinity';
    } else if (Math.abs(numValue) < 0.000001 && numValue !== 0) {
      return 'small';
    } else if (numValue > 1000000) {
      return 'large';
    } else if (Number.isInteger(numValue)) {
      return 'integer';
    } else {
      return 'decimal';
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setAnswerColor('normal');
  };

  const clearDisplay = () => {
    setDisplay('0');
    setWaitingForOperand(false);
    setAnswerColor('normal');
  };

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplay(String(digit));
      setWaitingForOperand(false);
      setAnswerColor('normal');
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit);
      setAnswerColor('normal');
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setAnswerColor('normal');
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setAnswerColor('normal');
    }
  };

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);
      
      setDisplay(String(newValue));
      setPreviousValue(newValue);
      setAnswerColor(getAnswerColor(newValue));
      addToHistory(`${currentValue} ${operation} ${inputValue} = ${newValue}`);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '%':
        return firstValue % secondValue;
      case '^':
        return Math.pow(firstValue, secondValue);
      default:
        return secondValue;
    }
  };

  const scientificOperation = (operation) => {
    const inputValue = parseFloat(display);
    let result;

    switch (operation) {
      case 'sin':
        result = Math.sin(inputValue * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(inputValue * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(inputValue * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(inputValue);
        break;
      case 'ln':
        result = Math.log(inputValue);
        break;
      case 'sqrt':
        result = Math.sqrt(inputValue);
        break;
      case 'square':
        result = inputValue * inputValue;
        break;
      case 'cube':
        result = inputValue * inputValue * inputValue;
        break;
      case 'factorial':
        result = factorial(inputValue);
        break;
      case 'inverse':
        result = 1 / inputValue;
        break;
      case 'abs':
        result = Math.abs(inputValue);
        break;
      default:
        return;
    }

    setDisplay(String(result));
    setAnswerColor(getAnswerColor(result));
    addToHistory(`${operation}(${inputValue}) = ${result}`);
    setWaitingForOperand(true);
  };

  const factorial = (n) => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const memoryOperation = (operation) => {
    const inputValue = parseFloat(display);
    
    switch (operation) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        setWaitingForOperand(true);
        setAnswerColor(getAnswerColor(memory));
        break;
      case 'M+':
        setMemory(memory + inputValue);
        setWaitingForOperand(true);
        break;
      case 'M-':
        setMemory(memory - inputValue);
        setWaitingForOperand(true);
        break;
      default:
        break;
    }
  };

  const addToHistory = (calculation) => {
    setHistory(prev => [...prev.slice(-9), calculation]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const handleKeyPress = (event) => {
    if (event.key >= '0' && event.key <= '9') {
      inputDigit(parseInt(event.key));
    } else if (event.key === '.') {
      inputDecimal();
    } else if (event.key === '+' || event.key === '-') {
      performOperation(event.key);
    } else if (event.key === '*') {
      performOperation('×');
    } else if (event.key === '/') {
      performOperation('÷');
    } else if (event.key === 'Enter' || event.key === '=') {
      performOperation('=');
    } else if (event.key === 'Escape') {
      clearAll();
    } else if (event.key === 'Backspace') {
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [display, waitingForOperand]);

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    document.documentElement.style.setProperty('--primary-gradient', themes[themeName].primary);
    document.documentElement.style.setProperty('--secondary-gradient', themes[themeName].secondary);
    document.documentElement.style.setProperty('--accent-gradient', themes[themeName].accent);
    document.documentElement.style.setProperty('--success-gradient', themes[themeName].success);
  };

  useEffect(() => {
    changeTheme(currentTheme);
  }, [currentTheme]);

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="calculator-header">
          <h1>Super Calculator</h1>
          <div className="header-controls">
            <button 
              className="mode-toggle"
              onClick={() => setIsScientific(!isScientific)}
            >
              {isScientific ? 'Standard' : 'Scientific'}
            </button>
            <div className="theme-selector">
              <select 
                value={currentTheme} 
                onChange={(e) => changeTheme(e.target.value)}
                className="theme-dropdown"
              >
                {Object.keys(themes).map(theme => (
                  <option key={theme} value={theme}>
                    {themes[theme].name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="display-container">
          <div className="history">
            {history.map((item, index) => (
              <div key={index} className="history-item">{item}</div>
            ))}
          </div>
          <div className={`display answer-${answerColor}`}>{display}</div>
        </div>

        <div className="memory-row">
          <button onClick={() => memoryOperation('MC')} className="memory-btn">MC</button>
          <button onClick={() => memoryOperation('MR')} className="memory-btn">MR</button>
          <button onClick={() => memoryOperation('M+')} className="memory-btn">M+</button>
          <button onClick={() => memoryOperation('M-')} className="memory-btn">M-</button>
        </div>

        {isScientific && (
          <div className="scientific-panel">
            <div className="scientific-row">
              <button onClick={() => scientificOperation('sin')} className="scientific-btn">sin</button>
              <button onClick={() => scientificOperation('cos')} className="scientific-btn">cos</button>
              <button onClick={() => scientificOperation('tan')} className="scientific-btn">tan</button>
              <button onClick={() => scientificOperation('log')} className="scientific-btn">log</button>
            </div>
            <div className="scientific-row">
              <button onClick={() => scientificOperation('ln')} className="scientific-btn">ln</button>
              <button onClick={() => scientificOperation('sqrt')} className="scientific-btn">√</button>
              <button onClick={() => scientificOperation('square')} className="scientific-btn">x²</button>
              <button onClick={() => scientificOperation('cube')} className="scientific-btn">x³</button>
            </div>
            <div className="scientific-row">
              <button onClick={() => scientificOperation('factorial')} className="scientific-btn">n!</button>
              <button onClick={() => scientificOperation('inverse')} className="scientific-btn">1/x</button>
              <button onClick={() => scientificOperation('abs')} className="scientific-btn">|x|</button>
              <button onClick={() => performOperation('^')} className="scientific-btn">x^y</button>
            </div>
          </div>
        )}

        <div className="buttons">
          <div className="button-row">
            <button onClick={clearAll} className="clear-btn">AC</button>
            <button onClick={clearDisplay} className="clear-btn">C</button>
            <button onClick={() => performOperation('%')} className="operator-btn">%</button>
            <button onClick={() => performOperation('÷')} className="operator-btn">÷</button>
          </div>
          <div className="button-row">
            <button onClick={() => inputDigit(7)} className="number-btn">7</button>
            <button onClick={() => inputDigit(8)} className="number-btn">8</button>
            <button onClick={() => inputDigit(9)} className="number-btn">9</button>
            <button onClick={() => performOperation('×')} className="operator-btn">×</button>
          </div>
          <div className="button-row">
            <button onClick={() => inputDigit(4)} className="number-btn">4</button>
            <button onClick={() => inputDigit(5)} className="number-btn">5</button>
            <button onClick={() => inputDigit(6)} className="number-btn">6</button>
            <button onClick={() => performOperation('-')} className="operator-btn">-</button>
          </div>
          <div className="button-row">
            <button onClick={() => inputDigit(1)} className="number-btn">1</button>
            <button onClick={() => inputDigit(2)} className="number-btn">2</button>
            <button onClick={() => inputDigit(3)} className="number-btn">3</button>
            <button onClick={() => performOperation('+')} className="operator-btn">+</button>
          </div>
          <div className="button-row">
            <button onClick={() => inputDigit(0)} className="number-btn zero">0</button>
            <button onClick={inputDecimal} className="number-btn">.</button>
            <button onClick={() => performOperation('=')} className="equals-btn">=</button>
          </div>
        </div>

        <div className="history-controls">
          <button onClick={clearHistory} className="history-btn">Clear History</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator; 