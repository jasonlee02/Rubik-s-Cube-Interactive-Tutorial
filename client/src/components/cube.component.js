import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame, useThree, useLoader } from '@react-three/fiber/';
import { useGesture } from '@use-gesture/react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as THREE from 'three';
import arrowup from '../assets/arrowup.png';
import arrowdown from '../assets/arrowdown.png';
import arrowleft from '../assets/arrowleft.png';
import arrowright from '../assets/arrowright.png';
import blankimg from '../assets/blank.png';

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

const raycaster = new THREE.Raycaster();
let pointer = new THREE.Vector2();
const mouseVector = new THREE.Vector2();

let normalVector = new THREE.Vector3();
let faceIndex = -1;
let point = 0;

const vup = new THREE.Vector3(0, 1, 0);
const vdown = new THREE.Vector3(0, -1, 0);
const vright = new THREE.Vector3(1, 0 ,0);
const vleft = new THREE.Vector3(-1, 0, 0);
const vfront = new THREE.Vector3(0, 0, 1);
const vback = new THREE.Vector3(0, 0, -1); 

function Cubie(props){
    const index = props.cubieNum;
    const group = React.useRef();
    let originalRotationX = useRef(0);
    let originalRotationY = useRef(0);
    let originalRotationZ = useRef(0);
    let currentRotation = 0;

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
                    group.current.rotation.x = (Math.PI / 2) + originalRotationX.current;
                    originalRotationX.current = group.current.rotation.x;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 2:
                group.current.rotation.x -= rotationSpeed; 
                if (currentRotation>= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.x = -(Math.PI / 2) + originalRotationX.current;
                    originalRotationX.current = group.current.rotation.x;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 3:
                group.current.rotation.y += rotationSpeed;
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.y = (Math.PI / 2) + originalRotationY.current;
                    originalRotationY.current = group.current.rotation.y;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 4:
                group.current.rotation.y -= rotationSpeed;
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.y = -(Math.PI / 2) + originalRotationY.current;
                    originalRotationY.current = group.current.rotation.y;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 5:
                group.current.rotation.z += rotationSpeed;
                if (currentRotation >= Math.PI / 2){
                    currentRotation = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.z = (Math.PI / 2) + originalRotationZ.current;
                    originalRotationZ.current = group.current.rotation.z;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            case 6:
                group.current.rotation.z -= rotationSpeed;
                if (currentRotation >= Math.PI / 2){
                    currentRotation  = 0;
                    currentTurn[index][1] = 0;
                    group.current.rotation.z = -(Math.PI / 2) + originalRotationZ.current;
                    originalRotationZ.current = group.current.rotation.z;
                }
                else{
                    currentRotation += rotationSpeed;
                }
                break;
            default: 
                break;
        }
    })

    const camera = useThree((state) => state.camera);
    const cubie = React.useRef();

    //order: up, right, down, left
    const localVectors = useRef(
        [
            [vup.clone(), vback.clone(), vdown.clone(), vfront.clone()], //right
            [vup.clone(), vfront.clone(), vdown.clone(), vback.clone()], //left
            [vback.clone(), vright.clone(), vfront.clone(), vleft.clone()], //top
            [vfront.clone(), vright.clone(), vback.clone(), vleft.clone()], //down
            [vup.clone(), vright.clone(), vdown.clone(), vleft.clone()], //front
            [vup.clone(), vleft.clone(), vdown.clone(), vright.clone()] //back
        ]
    );

    const vectorLocalUp = useRef(new THREE.Vector3());
    const vectorLocalRight = useRef(new THREE.Vector3());
    const vectorLocalDown = useRef(new THREE.Vector3());
    const vectorLocalLeft = useRef(new THREE.Vector3());
    const vectorLocalUp2d = useRef(new THREE.Vector2());
    const vectorLocalRight2d = useRef(new THREE.Vector2());
    const vectorLocalDown2d = useRef(new THREE.Vector2());
    const vectorLocalLeft2d = useRef(new THREE.Vector2());

    const bind = useGesture(
        {
            onDragStart: ({initial: [x, y]}) => {
                //ndc = normalized device coordinates
                pointer.x = (( x - window.innerWidth * 0.05) / (window.innerWidth * .4) ) * 2 - 1;
                pointer.y = - ( (y - window.innerHeight * 0.25) / (window.innerHeight * .5) ) * 2 + 1;
                raycaster.setFromCamera(pointer, camera);
                var intersect = raycaster.intersectObject(cubie.current, true);
                
                faceIndex = Math.floor(intersect[0].faceIndex / 2);  
                vectorLocalUp.current = localVectors.current[faceIndex][0];
                vectorLocalRight.current = localVectors.current[faceIndex][1];
                vectorLocalDown.current = localVectors.current[faceIndex][2];
                vectorLocalLeft.current = localVectors.current[faceIndex][3];

                point = intersect[0].point;
                console.log(point)

                let temp = vectorLocalUp.current;
                temp.project(camera);
                vectorLocalUp2d.current.set(temp.x * window.innerWidth * 0.4, -temp.y * window.innerHeight * 0.5);

                temp = vectorLocalRight.current;
                temp.project(camera)
                vectorLocalRight2d.current.set(temp.x * window.innerWidth * 0.4, -temp.y * window.innerHeight * 0.5);

                temp = vectorLocalDown.current;
                temp.project(camera)
                vectorLocalDown2d.current.set(temp.x * window.innerWidth * 0.4, -temp.y * window.innerHeight * 0.5);

                temp = vectorLocalLeft.current;
                temp.project(camera)
                vectorLocalLeft2d.current.set(temp.x * window.innerWidth * 0.4, -temp.y * window.innerHeight * 0.5);
            },

            onDrag: ({event, movement: [x, y]}) => {
                event.stopPropagation();
                showDirection(x, y);
            },

            onDragEnd: ({event, movement: [x, y]}) => {
                event.stopPropagation();
                doTurn(x, y);
                setmap0(blankTexture);
                setmap1(blankTexture);
                setmap2(blankTexture);
                setmap3(blankTexture);
                setmap4(blankTexture);
                setmap5(blankTexture);
            }
        }
    )

    const arrowUpTexture = useLoader(THREE.TextureLoader, arrowup);
    const arrowDownTexture = useLoader(THREE.TextureLoader, arrowdown);
    const arrowRightTexture = useLoader(THREE.TextureLoader, arrowright);
    const arrowLeftTexture = useLoader(THREE.TextureLoader, arrowleft);
    const blankTexture = useLoader(THREE.TextureLoader, blankimg);

    const [map0, setmap0] = useState(blankTexture);
    const [map1, setmap1] = useState(blankTexture);
    const [map2, setmap2] = useState(blankTexture);
    const [map3, setmap3] = useState(blankTexture);
    const [map4, setmap4] = useState(blankTexture);
    const [map5, setmap5] = useState(blankTexture);

    let texture;

    function showDirection(x, y){
        mouseVector.set(x, y);
        let angToUp = Math.abs(mouseVector.angle() - vectorLocalUp2d.current.angle());
        let angToRight = Math.abs(mouseVector.angle() - vectorLocalRight2d.current.angle());
        let angToDown = Math.abs(mouseVector.angle() - vectorLocalDown2d.current.angle());
        let angToLeft = Math.abs(mouseVector.angle() - vectorLocalLeft2d.current.angle());
        

        while (angToUp > (Math.PI * 2)){
            angToUp -= (Math.PI * 2);
        }
        while (angToRight > (Math.PI * 2)){
            angToRight -= (Math.PI * 2);
        }
        while (angToDown > (Math.PI * 2)){
            angToDown -= (Math.PI * 2);
        }
        while (angToLeft > (Math.PI * 2)){
            angToLeft -= (Math.PI * 2);
        }

        if (angToUp < angToRight && angToUp < angToLeft && angToUp < angToDown){
            texture = arrowUpTexture;
        }
        else if (angToRight < angToLeft && angToRight < angToDown){
            texture = arrowRightTexture;
        }
        else if (angToLeft < angToDown){
            texture = arrowLeftTexture;
        }
        else{
            texture = arrowDownTexture;
        }

        if (faceIndex === 0){
            setmap0(texture);
        }
        else if (faceIndex === 1){
            setmap1(texture);
        }
        else if (faceIndex === 2){
            setmap2(texture);
        }
        else if (faceIndex === 3){
            setmap3(texture);
        }
        else if (faceIndex === 4){
            setmap4(texture);
        }
        else if (faceIndex === 5){
            setmap5(texture);
        }
    } 

    function doTurn(x, y){
        const cubiePosition = cubie.current.position;
        let v;
        if (texture === arrowUpTexture){
            v = vectorLocalUp;
        }
        else if (texture === arrowRightTexture){
            v = vectorLocalRight;
        }
        else if (texture === arrowDownTexture){
            v = vectorLocalDown;
        }
        else if (texture === arrowLeftTexture){
            v = vectorLocalLeft;
        }
        //right side
        if (point.x >= 1.5499 && point.x <= 1.5501){
            if (texture === arrowUpTexture){
                if (cubiePosition.z < 0){
                    moveB();
                }
                else if (cubiePosition.z === 0){
                    moveS();
                }
                else if (cubiePosition.z > 0){
                    moveFi()
                }
            }
            else if (texture === arrowRightTexture){
                if (cubiePosition.y < 0){
                    moveD();
                }
                else if (cubiePosition.y === 0){
                    moveE();
                }
                else if (cubiePosition.y > 0){
                    moveUi();
                }
            }
            else if (texture === arrowDownTexture){
                if (cubiePosition.z < 0){
                    moveBi();
                }
                else if (cubiePosition.z === 0){
                    moveSi();
                }
                else if (cubiePosition.z > 0){
                    moveF()
                }
            }
            else if (texture === arrowLeftTexture){
                if (cubiePosition.y < 0){
                    moveDi();
                }
                else if (cubiePosition.y === 0){
                    moveEi();
                }
                else if (cubiePosition.y > 0){
                    moveU();
                }
            }
        }
        //left side
        else if (normalVector.equals(new THREE.Vector3(-1, 0, 0))){
            if (texture === arrowUpTexture){
                if (cubiePosition.z < 0){
                    moveBi();
                }
                else if (cubiePosition.z === 0){
                    moveSi();
                }
                else if (cubiePosition.z > 0){
                    moveF()
                }
            }
            else if (texture === arrowRightTexture){
                if (cubiePosition.y < 0){
                    moveD();
                }
                else if (cubiePosition.y === 0){
                    moveE();
                }
                else if (cubiePosition.y > 0){
                    moveUi();
                }
            }
            else if (texture === arrowDownTexture){
                if (cubiePosition.z < 0){
                    moveB();
                }
                else if (cubiePosition.z === 0){
                    moveS();
                }
                else if (cubiePosition.z > 0){
                    moveFi()
                }
            }
            else if (texture === arrowLeftTexture){
                if (cubiePosition.y < 0){
                    moveDi();
                }
                else if (cubiePosition.y === 0){
                    moveEi();
                }
                else if (cubiePosition.y > 0){
                    moveU();
                }
            }
        }
        //top side
        else if (normalVector.equals(new THREE.Vector3(0, 1, 0))){
            if (texture === arrowUpTexture){
                if (cubiePosition.x < 0){
                    moveLi();
                }
                else if (cubiePosition.x === 0){
                    moveMi();
                }
                else if (cubiePosition.x > 0){
                    moveR();
                }
            }
            else if (texture === arrowRightTexture){
                if (cubiePosition.z < 0){
                    moveBi();
                }
                else if (cubiePosition.z === 0){
                    moveSi();
                }
                else if (cubiePosition.z > 0){
                    moveF()
                }
            }
            else if (texture === arrowDownTexture){
                if (cubiePosition.x < 0){
                    moveL();
                }
                else if (cubiePosition.x === 0){
                    moveM();
                }
                else if (cubiePosition.x > 0){
                    moveRi();
                }
            }
            else if (texture === arrowLeftTexture){
                if (cubiePosition.z < 0){
                    moveB();
                }
                else if (cubiePosition.z === 0){
                    moveS();
                }
                else if (cubiePosition.z > 0){
                    moveFi()
                }
            }
        }
        //down side
        else if (normalVector.equals(new THREE.Vector3(0, -1, 0))){
            if (texture === arrowUpTexture){
                if (cubiePosition.x < 0){
                    moveLi();
                }
                else if (cubiePosition.x === 0){
                    moveMi();
                }
                else if (cubiePosition.x > 0){
                    moveR();
                }
            }
            else if (texture === arrowRightTexture){
                if (cubiePosition.z < 0){
                    moveB();
                }
                else if (cubiePosition.z === 0){
                    moveS();
                }
                else if (cubiePosition.z > 0){
                    moveFi()
                }
            }
            else if (texture === arrowDownTexture){
                if (cubiePosition.x < 0){
                    moveL();
                }
                else if (cubiePosition.x === 0){
                    moveM();
                }
                else if (cubiePosition.x > 0){
                    moveRi();
                }
            }
            else if (texture === arrowLeftTexture){
                if (cubiePosition.z < 0){
                    moveBi();
                }
                else if (cubiePosition.z === 0){
                    moveSi();
                }
                else if (cubiePosition.z > 0){
                    moveF()
                }
            }
        }
        //front side
        else if (point.z >= 1.5499 && point.z <= 1.5501){
            if (texture === arrowUpTexture){
                if (cubiePosition.x < 0){
                    moveLi();
                }
                else if (cubiePosition.x === 0){
                    moveMi();
                }
                else if (cubiePosition.x > 0){
                    moveR();
                }
            }
            else if (texture === arrowRightTexture){
                if (cubiePosition.y < 0){
                    moveD();
                }
                else if (cubiePosition.y === 0){
                    moveE();
                }
                else if (cubiePosition.y > 0){
                    moveUi();
                }
            }
            else if (texture === arrowDownTexture){
                if (cubiePosition.x < 0){
                    moveL();
                }
                else if (cubiePosition.x === 0){
                    moveM();
                }
                else if (cubiePosition.x > 0){
                    moveRi();
                }
            }
            else if (texture === arrowLeftTexture){
                if (cubiePosition.y < 0){
                    moveDi();
                }
                else if (cubiePosition.y === 0){
                    moveEi();
                }
                else if (cubiePosition.y > 0){
                    moveU();
                }
            }
        }
        //back side
        else if (normalVector.equals(new THREE.Vector3(0, 0, -1))){
            if (texture === arrowUpTexture){
                if (cubiePosition.x < 0){
                    moveL();
                }
                else if (cubiePosition.x === 0){
                    moveM();
                }
                else if (cubiePosition.x > 0){
                    moveRi();
                }
            }
            else if (texture === arrowRightTexture){
                if (cubiePosition.y < 0){
                    moveD();
                }
                else if (cubiePosition.y === 0){
                    moveE();
                }
                else if (cubiePosition.y > 0){
                    moveUi();
                }
            }
            else if (texture === arrowDownTexture){
                if (cubiePosition.x < 0){
                    moveLi();
                }
                else if (cubiePosition.x === 0){
                    moveMi();
                }
                else if (cubiePosition.x > 0){
                    moveR();
                }
            }
            else if (texture === arrowLeftTexture){
                if (cubiePosition.y < 0){
                    moveDi();
                }
                else if (cubiePosition.y === 0){
                    moveEi();
                }
                else if (cubiePosition.y > 0){
                    moveU();
                }
            } 
        }
    }

    //color order: right, left, top, bottom, front, back
    return(
        <group
            position = {[0, 0, 0]}
            ref = {group}> 
            <mesh
                position = {props.position}
                {...bind()}
                ref = {cubie}>
                <boxBufferGeometry attach = "geometry" args = {[cubieSize, cubieSize, cubieSize]}/>
                <meshStandardMaterial color = {colors[props.coloring[0]]} attach = {"material-0"} map = {map0}/>
                <meshStandardMaterial color = {colors[props.coloring[1]]} attach = {"material-1"} map = {map1}/>
                <meshStandardMaterial color = {colors[props.coloring[2]]} attach = {"material-2"} map = {map2}/>
                <meshStandardMaterial color = {colors[props.coloring[3]]} attach = {"material-3"} map = {map3}/>
                <meshStandardMaterial color = {colors[props.coloring[4]]} attach = {"material-4"} map = {map4}/>
                <meshStandardMaterial color = {colors[props.coloring[5]]} attach = {"material-5"} map = {map5}/> 
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

function moveR(){
    for (let i = 0; i < currentTurn.length; i++){
        if (currentTurn[i][0][0] === 1){
            currentTurn[i][1] = 2;
        }
    }
}
function moveRi(){
    
}
function moveL(){
    
}
function moveLi(){
    
}
function moveF(){
    for (let i = 0; i < currentTurn.length; i++){
        if (currentTurn[i][0][2] === 1){

        }
    }
}
function moveFi(){

}
function moveB(){

}
function moveBi(){

}
function moveU(){
    for (let i = 0; i < currentTurn.length; i++){
        if (currentTurn[i][0][1] === 1){

        }
    }
}
function moveUi(){

}
function moveD(){

}
function moveDi(){

}
function moveM(){

}
function moveMi(){

}
function moveS(){

}
function moveSi(){

}
function moveE(){

}
function moveEi(){

}

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