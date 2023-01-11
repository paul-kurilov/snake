import {useEffect, useReducer} from 'react';
import {useSound} from 'use-sound';

import eatSound from '../resources/sound/eat.mp3';
import hitSound from '../resources/sound/hit.mp3';




function reducer(state, action) {
    if (action.game) {
        return {...state, game: action.game};    
    }

    if (action.snakeDirection) {
        if (state.game !== "start") { return {...state}; } else {
            switch (action.snakeDirection) {
                case 'up': return {...state, snakeDirection: state.snakeDirection === "down" ? "down" : "up"};
                case 'right': return {...state, snakeDirection: state.snakeDirection === "left" ? "left" : "right"};
                case 'down': return {...state, snakeDirection: state.snakeDirection === "up" ? "up" : "down"};
                case 'left': return {...state, snakeDirection: state.snakeDirection === "right" ? "right" : "left"}; 
                default: throw new Error();
            }    
        } 
    } 
  
    if (action.snakeSpeed) {
        return {...state, snakeSpeed: action.snakeSpeed};    
    }

    if (action.snakeFood) {
        return {...state, snakeFood: action.snakeFood};    
    }

    if (action.snakeHead) {
        return {...state, snakeHead: action.snakeHead};    
    }
    
    if (action.snakeTail) {
        return {...state, snakeTail: action.snakeTail};
    }

    if (action.windowSize) {
        return {...state, windowSize: action.windowSize};    
    } 

}

const initialState = {
        game: "stop",  
        snakeDirection: "up",  
        snakeSpeed: 0,
        snakeFood: [],
        snakeHead: [],
        snakeTail: [],
        windowSize: []
    };

function initial(initialState) { 
    return initialState;
}



const Snake = () => {
    const [state, dispatch] = useReducer(reducer, initialState, initial); 
    const [soundEat] = useSound(eatSound);
    const [soundHit] = useSound(hitSound); 
    
    const snakeHead = document.createElement('div');
          snakeHead.classList.add('snakeHead'); 
          snakeHead.style.display = "none";
    const snakeFood = document.createElement('div');
          snakeFood.classList.add('snakeFood');
          snakeFood.style.display = "none"; 

          
    useEffect(() => {
        document.body.appendChild(snakeHead);  
        document.body.appendChild(snakeFood);  
        window.addEventListener("resize", resizeHandler);
        resizeHandler();
        init();
        return () => {
          window.removeEventListener("resize", resizeHandler);
        };
    }, []); 

    useEffect(() => {  
        if (state.game === "start") {
            const snakeHead = document.querySelector('.snakeHead');
            const snakeFood = document.querySelector('.snakeFood');
            snakeHead.style.display = "block";
            snakeFood.style.display = "block";
            
            const interval = setInterval(move, 4);
            return () => clearInterval(interval);
        } 
    }, [state.snakeHead, state.game]);

    
    useEffect(() => {
        const snakeFood = document.querySelector('.snakeFood');
        snakeFood.style.left = `${state.snakeFood[0]}px`;
        snakeFood.style.top = `${state.snakeFood[1]}px`;
        snakeFood.animate([
            {transform: `rotate(-300deg) scale(0)`},
            {transform: `rotate(90deg) scale(${Math.random() * (5 - 1) + 1})`},
            {transform: `rotate(0deg) scale(1)`}
        ], {
            duration: 1500
        });

        switch (state.snakeTail.length) {
            default: break;
            case 5: if (state.snakeSpeed < 2) { changeSpeed(2); } break;
            case 10: if (state.snakeSpeed < 3) { changeSpeed(3); } break;
            case 20: if (state.snakeSpeed < 4) { changeSpeed(4); } break;
            case 30: if (state.snakeSpeed < 5) { changeSpeed(5); } break;
            case 50: if (state.snakeSpeed < 6) { changeSpeed(6); } break;
            case 70: if (state.snakeSpeed < 7) { changeSpeed(7); } break;
            case 90: if (state.snakeSpeed < 8) { changeSpeed(8); } break;
            case 120: if (state.snakeSpeed < 9) { changeSpeed(9); } break;
            case 150: if (state.snakeSpeed < 10) { changeSpeed(10); } break;
        }
    }, [state.snakeFood]);

    useEffect(() => { 
        rotateHead();  
    }, [state.snakeDirection]);
    
  
    
 
    function rotateHead() {
        const snakeHead = document.querySelector('.snakeHead'); 
        let deg = 0;  
        switch (state.snakeDirection) {
            default: break; 
            case "up": deg = -90; break;
            case "right": deg = 0; break;
            case "down": deg = 90; break;
            case "left": deg = 180; break;
        } 
        snakeHead.style.transform = `rotate(${deg}deg)`;
    }
 
    function resizeHandler() { 
        dispatch({windowSize: [document.documentElement.clientWidth, document.documentElement.clientHeight]});
    }
    // const resizeHandler = () => dispatch({windowSize: [400, 400]}); // tmp

    function foodPosition() {        
        const w = parseInt(window.getComputedStyle( document.querySelector('.snakeFood') ).getPropertyValue('width'));
        const h = parseInt(window.getComputedStyle( document.querySelector('.snakeFood') ).getPropertyValue('height'));
        const winW = document.documentElement.clientWidth - w;
        const winH = document.documentElement.clientHeight - h;
        const xF = Math.floor(Math.random() * (winW - 1) + 1);
        const yF = Math.floor(Math.random() * (winH - 1) + 1);  
        // const xF = Math.floor(Math.random() * (150 - 1)) + 1;   // tmp
        // const yF = Math.floor(Math.random() * (150 - 1)) + 1;   // tmp

        dispatch({snakeFood: [xF, yF, w, h]});
    }

    function changeSpeed(speed) {
        const allLength = state.snakeTail.length + 1;
        const s = state.snakeHead[0][2];
        const cut = Math.ceil(s / speed);
        
        let all = [...state.snakeHead];
        state.snakeTail.forEach((item, i) => { 
            all.push(...item);
        });

        let newHT = [];
        let newTail = [];
        let tmpT = [];

        let c = 0;
        let ac = 0;
        all.forEach((item, i) => {
            if (ac < allLength) {
                c++;
                if (i < cut) {
                    newHT.push(item);
                } else { 
                    tmpT.push(item);
                }
                if (c >= cut) { 
                    if (ac > 0) { 
                        newTail.push(tmpT);
                    }
                    ac++;
                    tmpT = [];
                    c = 0; 
                }
            }
        }); 

        dispatch({snakeHead: newHT}); 
        dispatch({snakeTail: newTail}); 
        dispatch({snakeSpeed: speed});  
    }



    const init = () => { 
        const speed = 1;
        const s = parseInt(window.getComputedStyle( document.querySelector('.snakeHead') ).getPropertyValue('width'));
        const winW = document.documentElement.clientWidth - s;
        const winH = document.documentElement.clientHeight - s;
        const x = Math.floor(Math.random() * (winW - 1) + 1);
        const y = Math.floor(Math.random() * (winH - 1) + 1);  
        // const x = 150; // tmp
        // const y = 150; // tmp 

        let snakeHT = [[x, y, s]];
        switch ( Math.floor(Math.random() * (5 - 1) + 1 )) {
            default: 
            case 1: 
                dispatch({snakeDirection: 'up'}); 
                for (let i = 1; i < Math.ceil(s / speed); i++) { snakeHT.push([x, y + i, s]); } 
                break;
            case 2: 
                dispatch({snakeDirection: 'right'}); 
                for (let i = 1; i < Math.ceil(s / speed); i++) { snakeHT.push([x - i, y, s]); } 
                break;
            case 3: 
                dispatch({snakeDirection: 'down'}); 
                for (let i = 1; i < Math.ceil(s / speed); i++) { snakeHT.push([x, y - i, s]); } 
                break;
            case 4: 
                dispatch({snakeDirection: 'left'}); 
                for (let i = 1; i < Math.ceil(s / speed); i++) { snakeHT.push([x + i, y, s]); } 
                break;
        } 

        dispatch({snakeHead: snakeHT});
        dispatch({snakeSpeed: speed});
        foodPosition();

        document.addEventListener('keydown', (e) => {
            switch (e.code) {
                default: 
                    dispatch({game: 'start'});
                    document.querySelector('.menuGame').style.display = "none";
                    break;
                case "Escape": 
                    dispatch({game: 'stop'}); 
                    const menu = document.querySelector('.menuGame');
                    menu.style.display = "block";
                    menu.style.opacity = '0.7';
                    break;
                case "ArrowUp": dispatch({snakeDirection: 'up'}); break;
                case "ArrowRight": dispatch({snakeDirection: 'right'}); break;
                case "ArrowDown": dispatch({snakeDirection: 'down'}); break;
                case "ArrowLeft": dispatch({snakeDirection: 'left'}); break;
            } 
        }); 
    }

    
    const addTail = () => {  
        const cT = state.snakeTail.length;
        let x = state.snakeHead[state.snakeHead.length - 1][0];
        let y = state.snakeHead[state.snakeHead.length - 1][1]; 
        const speed = state.snakeSpeed;
        const s = state.snakeHead[0][2];

        let snakeTT = [];
        switch (state.snakeDirection) {
            default: break;
            case "up": for (let i = 1; i <= Math.ceil(s / speed); i++) { snakeTT.push([x, y + i]); } break;
            case "right": for (let i = 1; i <= Math.ceil(s / speed); i++) { snakeTT.push([x - i, y]); } break;
            case "down": for (let i = 1; i <= Math.ceil(s / speed); i++) { snakeTT.push([x, y - i]); } break;
            case "left":for (let i = 1; i <= Math.ceil(s / speed); i++) { snakeTT.push([x + i, y]); } break;
        }
        
        let newTail = [...state.snakeTail];
        if (state.snakeTail.length === 0) {
            newTail.push(snakeTT);
        } else {
            newTail.push(state.snakeTail[state.snakeTail.length - 1]);    
        }
        dispatch({snakeTail: newTail}); 

        let sX = newTail[newTail.length - 1][0][0];
        let sY = newTail[newTail.length - 1][0][1];

        const addST = document.createElement('div');
        addST.classList.add(`snakeTail`, `tailN${cT}`);
        addST.style.left = `${sX}px`;
        addST.style.top = `${sY}px`;
        document.body.append(addST);  
    }

    
    const move = () => {
        let x = state.snakeHead[0][0];
        let y = state.snakeHead[0][1];
        let xF = state.snakeFood[0];
        let yF = state.snakeFood[1];
        
        switch (state.snakeDirection) {
            default:  
            case "up": y = y > -state.snakeHead[0][2] ? y - state.snakeSpeed : state.windowSize[1]; break;
            case "right": x = x < state.windowSize[0] ? x + state.snakeSpeed : -state.snakeHead[0][2]; break;
            case "down": y = y < state.windowSize[1] ? y + state.snakeSpeed : -state.snakeHead[0][2]; break;
            case "left": x = x > -state.snakeHead[0][2] ? x - state.snakeSpeed : state.windowSize[0]; break;
        }

        let deleteTail = 0;

        let newHT = [[x, y, state.snakeHead[0][2]], ...state.snakeHead];
        newHT.pop(); 
        dispatch({snakeHead: newHT}); 

        if (y + state.snakeHead[0][2] > yF && y < yF + state.snakeFood[3] && x + state.snakeHead[0][2] > xF && x < xF + state.snakeFood[2]) {
            foodPosition();
            addTail();
            soundEat();
        } else {
            if (state.snakeTail.length > 0) { 
                let fX = state.snakeHead[state.snakeHead.length - 1][0];
                let fY = state.snakeHead[state.snakeHead.length - 1][1];
                let newTail = [];

                
                const depth = Math.floor(state.snakeHead[0][2] / 2);
                state.snakeTail.forEach((item, i) => { 
                    let xF = item[0][0];
                    let yF = item[0][1];
                    if (i > 0 && y + depth > yF && y < yF + depth && x + depth > xF && x < xF + depth) {
                        deleteTail = i;
                    }
                    if (deleteTail > 0) {
                        const delElement = document.querySelector(`.tailN${i}`);

                        delElement.animate([
                            {transform: `rotate(0deg) scale(0)`, filter: 'opacity(100%)'},
                            {transform: `rotate(${Math.random() * (300 - 1) + 1}deg) scale(${Math.random() * (20 - 1) + 1})`, filter: 'opacity(0%)'}
                        ], {
                            duration: 2000
                        });
                        dispatch({snakeFood: [-1000, -1000]});
                        setTimeout(() => {
                            delElement.parentNode.removeChild(delElement);
                        }, 1500);

                    }
                });

                if (deleteTail > 0) {
                    soundHit();
                    setTimeout(() => {
                        foodPosition();
                    }, 1500);
                }


                state.snakeTail.forEach((item, i) => { 
                    if (i < deleteTail || deleteTail === 0) {
                        let tX = item[item.length - 1][0];
                        let tY = item[item.length - 1][1];
    
                        let tmpT = [[fX, fY], ...item];
                        tmpT.pop(); 
                        newTail.push(tmpT);
    
                        fX = tX;
                        fY = tY;    
                    }
                }); 
                 
                dispatch({snakeTail: newTail}); 
            }
        }
        
        if (deleteTail === 0) {
            paintSnake(); 
        }
         
    }
 
    
    function paintSnake() {
        const snakeHead = document.querySelector('.snakeHead'); 
        snakeHead.style.left = `${state.snakeHead[0][0]}px`;
        snakeHead.style.top = `${state.snakeHead[0][1]}px`;

        state.snakeTail.forEach((item, i) => { 
            const snakeTail = document.querySelector(`.tailN${i}`);
            snakeTail.style.left = `${item[0][0]}px`;
            snakeTail.style.top = `${item[0][1]}px`;
        });  
    }

 

    return (
        <>  
            <div className='score'>
                <div className='row'>
                    <div className="col-6">
                        <div className='food'></div>
                    </div>
                    <div className="col-6">
                        <span>{state.snakeTail.length}</span>
                    </div>
                </div>
                <div className='row'>
                    <div className="col-6">
                        <div className='speed'></div>
                    </div>
                    <div className="col-6">
                        <span>{state.snakeSpeed}</span>
                    </div>
                </div>
            </div>

            <div className='menuGame'>
                <div className='row'>
                    <div className="col-6"> 
                        <p>Press "Space" to start</p>
                    </div>
                    <div className="col-6"> 
                        <p>Press "Esc" to pause</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Snake;