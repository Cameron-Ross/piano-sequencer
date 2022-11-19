import React from "react";
import Key from "./Key";
import "../App.css";

const NOTES = ["C","Db","D","Eb","E","F","Gb","G","Ab","A", "Bb", "B"];


function Octave(props: {index: number}) {

    return(
        <div className="piano">
            {GenerateKeys()}
        </div>
    )

    function GenerateKeys() {
        let keys = NOTES.map((item: string, index: number) => {
            return (
                <Key name={item} key = {index} octaveIndex = {props.index}/>
            )
        });

        return keys;
    }

}




export default Octave;