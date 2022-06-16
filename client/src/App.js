import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import Cube from "./components/cube.component";
import './components/cube.component.css';
import TestCube from "./testing/testcubecontainer";

function App() {
  return (
    <div className = "cubeelement">
        <Cube 
        cubeState = {[
          [0, 1, 3, 5, 5, 4],
          [7, 0, 3, 5, 4, 6]
        ]}
        />
    </div>
  );
}

export default App;
