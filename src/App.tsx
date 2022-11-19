import React from 'react';
import './App.css';
import Octave from './Components/Octave';


function App() {

  return (
    <div className="App">
      {Piano()}
    </div>
  );

  function Piano() {
    return [2,3,4,5].map((e) => <Octave index={e}/>);
  }
}

export default App;
