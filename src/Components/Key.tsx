import React from "react";
import "../App.css";


function Key(props: {name: string}) {

    let isFlat: boolean = props.name.length > 1;

    return(
        <div className= {isFlat ? "key flat" : "key"} onClick = {() => console.log(props.name)}>
             <div className="key-text">
                {!isFlat ? props.name : ""}
            </div>
        </div>
    )

    
}



export default Key;