import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Cube from "./components/cube.component";
import './components/cube.component.css';
import TestCube from "./testing/testcubecontainer";

function App() {
  //color order: right, left, top, bottom, front, back
  //colors: white, red, blue, orange, green, yellow, black
  return (
    <div className = "cubeelement">
        <Cube 
        cubeState = {[
          [6, 1, 5, 6, 6, 2],
          [6, 1, 5, 6, 6, 6],
          [6, 1, 5, 6, 4, 6],

          [6, 1, 6, 6, 6, 2],
          [6, 1, 6, 6, 6, 6],
          [6, 1, 6, 6, 4, 6],

          [6, 1, 6, 0, 6, 2],
          [6, 1, 6, 0, 6, 6],
          [6, 1, 6, 0, 4, 6],

          [6, 6, 5, 6, 6, 2],
          [6, 6, 5, 6, 6, 6],
          [6, 6, 5, 6, 4, 6],

          [6, 6, 6, 6, 6, 2],
          [6, 6, 6, 6, 6, 6],
          [6, 6, 6, 6, 4, 6],

          [6, 6, 6, 0, 6, 2],
          [6, 6, 6, 0, 6, 6],
          [6, 6, 6, 0, 4, 6],

          [3, 6, 5, 6, 6, 2],
          [3, 6, 5, 6, 6, 6],
          [3, 6, 5, 6, 4, 6],

          [3, 6, 6, 6, 6, 2],
          [3, 6, 6, 6, 6, 6],
          [3, 6, 6, 6, 4, 6],

          [3, 6, 6, 0, 6, 2],
          [3, 6, 6, 0, 6, 6],
          [3, 6, 6, 0, 4, 6]
        ]}
        />
    </div>
  );
}

export default App;
