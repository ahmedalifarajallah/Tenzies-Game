import React from 'react';
import './App.css';
import Die from './component/Die';
import {nanoid} from "nanoid";
import Confetti from 'react-confetti';

function App() {

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [gameTime, setGameTime] = React.useState(45);

  function incGameTime() {
    setGameTime(prevTime => prevTime -= 1);
  }

  React.useEffect(() => {
    const interval = setInterval(incGameTime, 1000);
    if(gameTime === 0) {
      clearInterval(interval)
      console.log('Game Over');
    } else if (tenzies) {
      clearInterval(interval)
    }
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameTime]);

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every(die => die.value === firstValue);
    if(allHeld && allSameValue) {
      setTenzies(true);
      console.log('You won');
    }
  }, [dice])

  function generateDice() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = [];
    for(let i=0; i<10; i++) {
      newDice.push(generateDice());
    }
    return newDice;
  }

  const diceElements = dice.map(die => 
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={()=> holdDice(die.id)}/>
  );

  function rollDice() {
    if(!tenzies && gameTime !== 0) {
      setDice(preventDice => preventDice.map(die => {
        return die.isHeld ? die : generateDice();
      }));
    } else {
      setTenzies(false);
      setGameTime(45);
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((preventDice) => preventDice.map(die => {
      return die.id === id 
        ? {...die, isHeld: !die.isHeld}
        : die
    }))
  }

  return (
  <main>
    <div className="app">
      {tenzies && <Confetti width={360} height={320} />}
      <div className="outer-box">
        <div className="inside-box">
          <h3>Tenzies</h3>
          <h4>Timer : <span style={{color: gameTime <= 10 ? "red" : "gray"}}>{gameTime}</span> sec</h4>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className='numbers'>
            {diceElements}
          </div>
          <div 
          className='roll-btn' 
          onClick={rollDice}>
          {tenzies || gameTime === 0 ? 'New Game' : 'Roll'}
          </div>
        </div>
      </div>
    </div>
  </main>
  );
}

export default App;
