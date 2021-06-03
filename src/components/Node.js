import React from 'react'
import "./Node.css"

const Node = ({isStart, isEnd, row, col, isWall, mouseDown, mouseUp, changeNodeType, mouseLeave}) => {
    const classes = isStart ? "node-start" :isEnd ? "node-end" : isWall ? "iswall" : "";
    //console.log(isMousePressed,row,col);
    const localMouseDown = () =>{
        mouseDown(row,col);
    }

    const localMouseUp = () =>{
        mouseUp(row,col);
    }

    const toggleNode = () =>{
        //console.log(isMousePressed,row,col);
            changeNodeType(row,col);
    }
    const localMouseLeave = () =>{
        mouseLeave(row,col);
    }
    return (
        <div onMouseDown={localMouseDown} onMouseEnter={toggleNode} onMouseLeave={localMouseLeave} onMouseUp={localMouseUp} className={`node ${classes}`} id={`node-${row}-${col}`} >
            
        </div>
    )
}

export default Node


