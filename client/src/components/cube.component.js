import React, {useEffect} from 'react';
import {Canvas, useFrame, useThree} from '@react-three/fiber/';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';

const cubieSize = 1;
const distancingConstant = 1.05;
const rotationSteps = 100;
const rotationSpeed = (Math.PI / 2) / rotationSteps;
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
                //push to array for rendering and for turn logic
                CubieArray.push(<Cubie coloring = {props.cubeState[cubieNum]} position = {[x, y, z].map(distanceCubies)} key = {cubieNum} cubieNum = {cubieNum}/>)
                currentTurn.push([[x, y, z], 0]);
            }
        }
    }
    return CubieArray;
}
function Cubie(props){
    const index = props.cubieNum;
    const group = React.useRef();
    let originalRotationX = 0;
    let originalRotationY = 0;
    let originalRotationZ = 0;
    useFrame(() => {
        //get index to find the current turn
        switch(currentTurn[index][1]){
            case 0:
                break;
            case 1:
                group.current.rotation.x += rotationSpeed;
                //when turn is complete, reset the current rotation and tell currentTurn that the cubie is no longer turning 
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.x = (Math.PI / 2) + originalRotationX;
                    originalRotationX = group.current.rotation.x;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 2:
                group.current.rotation.x -= rotationSpeed;
                //when turn is complete, reset the current rotation and tell currentTurn that the cubie is no longer turning 
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.x = -(Math.PI / 2) + originalRotationX;
                    originalRotationX = group.current.rotation.x;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 3:
                group.current.rotation.y += rotationSpeed;
                //when turn is complete, reset the current rotation and tell currentTurn that the cubie is no longer turning 
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.y = (Math.PI / 2) + originalRotationY;
                    originalRotationY = group.current.rotation.y;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 4:
                group.current.rotation.y -= rotationSpeed;
                //when turn is complete, reset the current rotation and tell currentTurn that the cubie is no longer turning 
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.y = -(Math.PI / 2) + originalRotationY;
                    originalRotationY = group.current.rotation.y;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 5:
                group.current.rotation.z += rotationSpeed;
                //when turn is complete, reset the current rotation and tell currentTurn that the cubie is no longer turning 
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.z = (Math.PI / 2) + originalRotationZ;
                    originalRotationZ = group.current.rotation.z;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 6:
                group.current.rotation.z -= rotationSpeed;
                //when turn is complete, reset the current rotation and tell currentTurn that the cubie is no longer turning 
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.z = -(Math.PI / 2) + originalRotationZ;
                    originalRotationZ = group.current.rotation.z;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            default: 
                break;
        }
    })
    let currentRotation = 0;
    //relate current turn ints to turn functions
    //turn functions
    //color order: right, left, top, bottom, front, back
    return(
        <group
            position = {[0, 0, 0]}
            ref = {group}>
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
        </group>
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

//track each cubie's position and current turn
//used as a reference for each cubie's useFrame
const currentTurn = [];

//orbit controls
function CameraController() {
    const { camera, gl } = useThree();
    useEffect(
        () => {
            const controls = new OrbitControls(camera, gl.domElement);
            controls.enablePan = false;
            controls.mouseButtons = { RIGHT: THREE.MOUSE.ROTATE };
            return () => {
                controls.dispose();
            };
        },
        [camera, gl]
    );
    return null;
}
