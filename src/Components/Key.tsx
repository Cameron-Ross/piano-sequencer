import React from "react";
import "../App.css";

import * as Tone from "tone";

function Key(props: {name: string}) {

    let isFlat: boolean = props.name.length > 1;
    const synth = new Tone.Synth().toDestination();

    function playSynth() {
        console.log("clicked");
        synth.triggerAttackRelease(props.name[0] + "4", "8n");
    }

    return(
        <div className= {isFlat ? "key flat" : "key"} onClick = {() => playSynth()}>
             <div className="key-text">
                {!isFlat ? props.name : ""}
            </div>
        </div>
    )

    
}



export default Key;