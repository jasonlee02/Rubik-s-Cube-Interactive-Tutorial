import React, {useRef, useEffect} from 'react';
import {Canvas, useUpdate, useFrame, useThree} from '@react-three/fiber/';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

const cubieSize = 1;
const distancingConstant = 1.05;
const distanceCubies = (element) => {
    return element * distancingConstant * cubieSize;
}

export default function Cube(props){
    return(
        <Canvas>
            <CameraController />
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
                //labels the cubies 0-26
                const cubieNum = (x + 1) * 9 + (-y + 1) * 3 + (z + 1);
                CubieArray.push(<Cubie coloring = {props.cubeState[cubieNum]} position = {[x, y, z].map(distanceCubies)} key = {[x, y, z]}/>)
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

function move(axis, direction, layer){
    
}

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
       () => {
          const controls = new OrbitControls(camera, gl.domElement);
          controls.enablePan = false;
          controls.mouseButtons = {RIGHT: THREE.MOUSE.ROTATE};
          return () => {
            controls.dispose();
          };
       },
       [camera, gl]
    );
    return null;
 };
