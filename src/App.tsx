import React, { useState } from 'react';
import './App.css';
import * as Tone from "tone";

// A list of all the notes in an octave
const NOTES = ["C","Db","D","Eb","E","F","Gb","G","Ab","A", "Bb", "B"];
// Make a new instrument and set the destination to be the speakers
const synth = new Tone.Synth({ oscillator: { type: "square8" } }).toDestination();

function App() {
  return (
    <div className="App">
      {Piano()}
    </div>
  );

  //#region Render Functions
  function Piano() {
    return [4,5].map((e) => Octave(e));
  }

  function Octave(octaveIndex: number) {

    return(
      <div className="piano" key = {octaveIndex}>
        { NOTES.map((item) => Key(item, octaveIndex))}
      </div>
    )

  }

  function Key(note: string, octaveIndex: number) {
    // Find if the key is a flat based onm the length of the name
    let isFlat: boolean = note.length > 1;

    return(
      <div 
        className= {(isFlat ? "key flat" : "key")} 
        onMouseDown = {(event) => playNote(note + octaveIndex, event)} 
        onMouseEnter = {(event) => playNote(note + octaveIndex, event)}
        key = {note}
      >

        <div className="key-text">
          {!isFlat ? note : ""}
        </div>

      </div>
    )

    
  }
  //#endregion

  async function playNote(note: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    let mouseDown: boolean = event.buttons == 1;
    if(mouseDown) {
        // attack initiates the tone and trigger ends it. 
        // combining the two gives it a start and stop immediately
            // arg 1 > is a note. Standard 88 key piano goes from key A0 to C8 
            // arg 2 > is how the note should play for. either in seconds or note values
        synth.triggerAttackRelease(note, "4n");
    }
  }


}

export default App;
