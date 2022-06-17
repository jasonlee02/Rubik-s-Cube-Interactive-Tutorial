import React from 'react';
import { Canvas } from '@react-three/fiber/';
import {OrbitControls} from '@react-three/drei/';

const cubieSize = 1;
const distancingConstant = 1.1;
const distanceCubies = (element) => {
    return element * distancingConstant * cubieSize;
}

export default function Cube(props){
    return(
        <Canvas>
            <OrbitControls 
                enablePan = {false}/>
            <ambientLight intensity = {1}/>
            {getCubieList(props)}
        </Canvas>
    )
}

function getCubieList(props){
    let CubieArray = [];
    for (let x = -1; x <= 1; x++){
        for (let y = 1; y >= -1; y--){
            for (let z = -1; z <= 1; z++){
                const cubieNum = (x + 1) * 9 + (-y + 1) * 3 + (z + 1);
                CubieArray.push(<Cubie coloring = {props.cubeState[cubieNum]} position = {[x, y, z].map(distanceCubies)} key = {cubieNum}/>)
            }
        }
    }
    return CubieArray;
}

function Cubie(props){
    //color order: right, left, top, bottom, front, back
    return(
        <mesh
            position = {props.position}>
            <boxBufferGeometry attach = "geometry" args = {[cubieSize, cubieSize, cubieSize]}/>
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
    "#FF0000", 
    "#0000FF", 
    "#FF9500", 
    "#00FF00", 
    "#FFFF00", 
    "#000000"];