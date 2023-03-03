import React from 'react';

export default function Die(props) {
  return (
    <>
    <span onClick={props.holdDice} style={{backgroundColor: props.isHeld ? "#59E391" : "white"}}>{props.value}</span>
    </>
  )
}
