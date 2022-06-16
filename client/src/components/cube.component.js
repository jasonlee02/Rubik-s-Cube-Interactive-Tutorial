import React from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls} from '@react-three/drei';

export default function Cube(props){
    return(
        <Canvas>
            <Cubie coloring = {props.cubeState[0]}/>
            <OrbitControls />
            <ambientLight intensity = {0.5}/>
        </Canvas>
    )
}

function Cubie(props){
    //const getMaterial = this.getMaterial.bind(this);
    return(
        <mesh>
            <boxBufferGeometry attach = "geometry" args = {[1, 1, 1]}/>
            <meshStandardMaterial color = {colors[props.coloring[0]]} attach = {"material-0"}/>
            <meshStandardMaterial color = {colors[props.coloring[1]]} attach = {"material-1"}/>
            <meshStandardMaterial color = {colors[props.coloring[2]]} attach = {"material-2"}/>
            <meshStandardMaterial color = {colors[props.coloring[3]]} attach = {"material-3"}/>
            <meshStandardMaterial color = {colors[props.coloring[4]]} attach = {"material-4"}/>
            <meshStandardMaterial color = {colors[props.coloring[5]]} attach = {"material-5"}/> 
        </mesh>
    );
}
//colors: white, red, blue, orange, green, yellow, black
const colors = 
    ["#FFFFFF", 
    "#C41E3A", 
    "#0051BA", 
    "#FF5800", 
    "#009E60", 
    "#FFD500", 
    "#000000"];