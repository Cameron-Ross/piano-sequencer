import React, { useState } from "react";
import "../App.css";

import * as Tone from "tone";
import { setInterval } from "timers";

function Key(props: {name: string, octaveIndex: number}) {
    // Find if the key is a flat based onm the length of the name
    let isFlat: boolean = props.name.length > 1;
    // A state for if the key is being played
    const [playing, setPlaying] = useState(false);

    // Make a new instrument and set the destination to be the speakers
    const synth = new Tone.Synth().toDestination();
   

    async function playSynth(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        if(event.buttons == 1) {
            setPlaying(true);
            // setTimeout(() => {
            //     setPlaying(false)
            // }, 300);

            // attack initiates the tone and trigger ends it. 
            // combining the two gives it a start and stop immediately
                // arg 1 > is a note. Standard 88 key piano goes from key A0 to C8 
                // arg 2 > is how the note should play for. either in seconds or note values
            synth.triggerAttackRelease(props.name + props.octaveIndex, "4n");

        }
    }

    return(
        <div className= {(isFlat ? "key flat" : "key") + (playing ? " playing" : "")} onMouseDown = {(event) => playSynth(event)} onMouseEnter = {(event) => playSynth(event)}>
             <div className="key-text">
                {!isFlat ? props.name : ""}
            </div>
        </div>
    )

    
}



export default Key;