import React, { useState } from 'react';
import './App.css';
import * as Tone from "tone";

// A list of all the notes in an octave
const NOTES = ["C","Db","D","Eb","E","F","Gb","G","Ab","A", "Bb", "B"];
// Make a new instrument and set the destination to be the speakers
const synth = new Tone.Synth({ oscillator: { type: "square8" } }).toDestination();
// How many steps (columns) to include in the grid
const STEPS = 8;
// A list of octaves
const OCTAVES = [4,5];

let started = false;
let playing = false;
let stepCount = 0;


// TODO
  // Fix delay in animation
  // Have grid be in scrollable horizontal list
  // Update styling

function App() {

  const [stepGrid, setStepGrid] = useState<Cell[][]>(getClearGrid()); 
  const [currentStep, setCurrentStep] = useState<number>(stepCount); 
  
  return (
    <div className="App">
      <div className="sequencer">
        {Piano()}
        {Grid()}
      </div>

      <div className="play" onMouseDown = {() => {
        console.log("Playing", !playing);
        if(!playing) {

          if(!started) {
            Tone.start();
            Tone.getDestination().volume.rampTo(-10, 0.001);
            Loop();
            started = true;
          }
          
          Tone.Transport.start();
          playing = true;


        }
        else {  
          Tone.Transport.stop();
          playing = false;
        }
      }}
      >
        Play
      </div>

    </div>
  );

  function Loop() {

    function repeat(time: number) {
      console.log("Step:", stepCount);

      stepGrid.forEach((row: Cell[]) => {
        let cell: Cell = row[stepCount];
        if(cell.active) {
          playNote(cell.note, undefined, time);
        }
      })
      stepCount = (stepCount + 1) % STEPS;
      setCurrentStep(stepCount);
    }
    
    // set the tempo in beats per minute.
    Tone.Transport.bpm.value = 120;
    // telling the transport to execute our callback function every eight note.
    Tone.Transport.scheduleRepeat(repeat, "4n");

  }

  //#region Grid Render Functions
  function Grid() {
    let columns: JSX.Element[] = [];
    for (let index = 0; index < STEPS; index++) {
        columns.push(renderColumn(index));
    }

    return(
      <div className="grid">
        {columns}
      </div>
    )
  }

  function renderColumn(columnIndex: number) {

    let cells: JSX.Element[] = [];
    for (let index = 0; index < NOTES.length * OCTAVES.length; index++) {
      const element = stepGrid[index][columnIndex];
      cells.push(renderCell(element, index, columnIndex));
    }

    return(
      <div className = {columnIndex === currentStep ? "grid column active" : "grid column"} key = {columnIndex}>
        {cells}
      </div>
    )
  }

  function renderCell(cell: Cell, row: number, col: number) {
    return(
      <div 
        className = {cell.active ? "grid cell active" : "grid cell"} 
        key ={cell.note}
        onMouseDown = {() => onCellClick(row, col, !cell.active)}
      >
      
      </div>
    ) 
  }

  //#endregion

  //#region Piano Render Functions
  function Piano() {
    return(
      <div className="piano">
        {OCTAVES.map((e) => Octave(e))}
      </div>
    )
  }

  function Octave(octaveIndex: number) {

    return(
      <div className="octave" key = {octaveIndex}>
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

        <div className = {(isFlat ? "key text alt" : "key text")}>
          {note}
        </div>

      </div>
    )

    
  }
  //#endregion

  //#region helper functions 
  async function playNote(note: string, event?: React.MouseEvent<HTMLDivElement, MouseEvent>, time?: number) {
    let mouseDown: boolean = event !== undefined && event.buttons === 1;
    if(mouseDown || !event) {
        // attack initiates the tone and trigger ends it. 
        // combining the two gives it a start and stop immediately
            // arg 1 > is a note. Standard 88 key piano goes from key A0 to C8 
            // arg 2 > is how the note should play for. either in seconds or note values
            console.log(note);
        synth.triggerAttackRelease(note, "4n", time);
    }
  }

  function getClearGrid() {
    let grid: Cell[][] = [];
    let octaveIndex: number = 0;

    for (let row = 0; row < NOTES.length * OCTAVES.length; row++) {
      let currentRow: Cell[] = [];
      if(row !== 0 && row % NOTES.length === 0) octaveIndex++;

      for (let col = 0; col < STEPS; col++) {
        let cell: Cell = { active: false, note: NOTES[row % NOTES.length] + OCTAVES[octaveIndex]};
        currentRow.push(cell);
      }

      
      grid.push(currentRow);
    }

    return grid;
  }

  function onCellClick(row: number, col: number, enable: boolean) {
    stepGrid[row][col].active = enable;
    setStepGrid(stepGrid.concat([]));
  }
  //#endregion


}

type Cell = 
{
  /** Is the cell active? */
  active: boolean,
  /** The cell's note */
  note: string,
}

export default App;
