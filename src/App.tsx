import React, { useState } from 'react';
import './App.css';
import * as Tone from "tone";

// A list of all the notes in an octave
const NOTES2 = ["C","Db","D","Eb","E","F","Gb","G","Ab","A", "Bb", "B"];
const NOTES = ["B","Bb","A","Ab","G","Gb","F","E","Eb","D", "Db", "C"];
// Make a new instrument and set the destination to be the speakers
const synth = new Tone.Synth({ oscillator: { type: "square8" } }).toDestination();
// How many steps (columns) to include in the grid
const STEPS = 40;
// A list of octaves
const OCTAVES = [5,4];

let started = false;
let stepCount = 0;
let eventID = 0;


// TODO
  // Have grid be in scrollable horizontal list
  // Update styling

function App() {

  const [stepGrid, setStepGrid] = useState<Cell[][]>(getClearGrid()); 
  const [currentStep, setCurrentStep] = useState<number>(stepCount); 
  const [playing, setPlaying] = useState<boolean>(false); 
  
  return (
    <div className="App">

      <div style = {{display: "flex", flexDirection: "row", alignSelf: "center"}}>
        {PlayButton()}
        {ClearButton()}
        {SampleButton()}
      </div>

      <div style = {{display: "flex", flexDirection: "row"}}>
        {Piano()}
        {Grid()}
      </div>

    </div>
  );

  function Loop() {

    function repeat(time: number) {
      stepCount = (stepCount + 1) % STEPS;
      setCurrentStep(stepCount);

      stepGrid.forEach((row: Cell[]) => {
        let cell: Cell = row[stepCount];
        if(cell.active) {
          playNote(cell.note, undefined, time);
        }
      })
      
    }
    
    // set the tempo in beats per minute.
    Tone.Transport.bpm.value = 120;
    // telling the transport to execute our callback function every eight note.
    eventID = Tone.Transport.scheduleRepeat(repeat, "4n");

  }

  function PlayButton() {

    let buttonStyle: React.CSSProperties = {
      backgroundColor: !playing ? "green" : "#ac183c",
      textAlign: "center",
      alignSelf: "center",
      margin: 5,
      width: 75,
      height: 25,
      borderRadius: 10 
    };

    return(
      <div style={buttonStyle} onMouseDown = {() => onPress()}>
        <div style={{fontWeight: "bold", marginTop: 2, userSelect:"none"}}>
          {!playing ? "Play" : "Pause"}
        </div>
      </div>
    )

    function onPress() {
      if(!playing) {
        // Start Tone if it has not started already
        if(!started) {
          Tone.start();
          Tone.getDestination().volume.rampTo(-10, 0.001);
          Loop();
          started = true;
        }
        // Start transport
        Tone.Transport.start();
        // Play sound of current step immediately
        stepGrid.forEach((row: Cell[]) => {
          let cell: Cell = row[stepCount];
          if(cell.active) {
            playNote(cell.note, undefined);
          }
        })
        // Set playing to true
        setPlaying(true);
      }
      else {
        // Stop transport
        Tone.Transport.stop();
        // Set playing to false
        setPlaying(false);
      }
    }
  }

  function ClearButton() {

    let buttonStyle: React.CSSProperties = {
      backgroundColor: "#259692",
      textAlign: "center",
      alignSelf: "center",
      margin: 5,
      width: 75,
      height: 25,
      borderRadius: 10 
    };

    return(
      <div style={buttonStyle} onMouseDown = {() => onPress()}>
        <div style={{fontWeight: "bold", marginTop: 2}}>
          {"Clear"}
        </div>
      </div>
    )

    function onPress() {
      setStepGrid(getClearGrid());
      stepCount = 0;
      setCurrentStep(0);
      setPlaying(false);
      Tone.Transport.clear(eventID);
      started = false;
    }
  }

  function SampleButton() {

    let buttonStyle: React.CSSProperties = {
      backgroundColor: "#e09808",
      textAlign: "center",
      alignSelf: "center",
      margin: 5,
      width: 75,
      height: 25,
      borderRadius: 10 
    };

    return(
      <div style={buttonStyle} onMouseDown = {() => onPress()}>
        <div style={{fontWeight: "bold", marginTop: 2}}>
          {"Sample"}
        </div>
      </div>
    )

    function onPress() {
      setStepGrid(getClearGrid());
      stepCount = 0;
      setCurrentStep(0);
      Tone.Transport.stop();
      setPlaying(false);
      started = false;
    }
  }

  //#region Grid Render Functions
  function Grid() {
    let columns: JSX.Element[] = [];
    for (let index = 0; index < STEPS; index++) {
        columns.push(renderColumn(index));
    }

    return(
      <div style = {{flexDirection: "row", display: "flex"}}>
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
      <div 
        style={{backgroundColor: columnIndex === currentStep ? "#A3B33F" : "transparent", flexDirection: "column"}} key = {columnIndex}>
        {cells}
      </div>
    )
  }

  function renderCell(cell: Cell, row: number, col: number) {

    let cellStyle: React.CSSProperties = {
      backgroundColor: cell.active ? "red" : (cell.note.length !== 2 ? "#45474c" : "#66666a"),
      height: 25,
      width: 25,
      margin: 4,
    };

    return(
       <div key ={cell.note} onMouseDown = {() => onCellClick(row, col, !cell.active)} style = {cellStyle}/>
    ) 
  }

  //#endregion

  //#region Piano Render Functions
  function Piano() {
    return(
      <div style={{display: "flex", marginRight: 10, flexDirection: "column"}}>
        {OCTAVES.map((e) => Octave(e))}
      </div>
    )
  }

  function Octave(octaveIndex: number) {
    return(
      <div key = {octaveIndex}>
        { NOTES.map((item) => Key(item, octaveIndex))}
      </div>
    )

  }

  function Key(note: string, octaveIndex: number) {
    // Find if the key is a flat based onm the length of the name
    let isFlat: boolean = note.length > 1;

    let keyStyle: React.CSSProperties = {
      backgroundColor: !isFlat ? "white" : "black",
      height: 25,
      width: 75,
      marginTop: 4,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end'
    };

    let keyTextStyle: React.CSSProperties = {
      color: !isFlat ? "black" : "white",
      backgroundColor: "transparent",
      display: 'flex',
      fontWeight: "500",
      fontSize: 16,
      userSelect: "none",
      paddingRight: 5, 
    };

    return(
      <div onMouseDown = {(event) => playNote(note + octaveIndex, event)} onMouseEnter = {(event) => playNote(note + octaveIndex, event)} key = {note} style = {keyStyle}>
        <div style={keyTextStyle}>
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
