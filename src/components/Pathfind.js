import React, {useState, useEffect} from 'react'
import Node from './Node'
import Astar from '../algorithms/astar'
import Dijkstra from '../algorithms/dijkstra'
import DFS from '../algorithms/dfs'
import BFS from '../algorithms/bfs'
import './Pathfind.css'

const rows = 18;
const cols = 40;

let NODE_START_ROW = 0;
let NODE_START_COL = 0;
let NODE_END_ROW = rows-1;
let NODE_END_COL = cols-1;
let isMouseDown = false;
let clickedOnStart = false;
let clickedOnEnd = false;

const Pathfind = () => {
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [VisitedNodes, setVisitedNodes] = useState([]);

    useEffect(() => {
        initializeGrid();
    }, [])//runs before anything is rendered onto the dom

    const initializeGrid = () => {
        const grid = new Array(rows);
        for(let i=0;i<rows;i++){
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        // const startNode = grid[NODE_START_ROW][NODE_START_COL];
        // const endNode = grid[NODE_END_ROW][NODE_END_COL];
        // startNode.isWall = false;
        // endNode.isWall = false;
        setGrid(grid);
    };

    const createSpot = (grid) => {
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j] = new Spot(i,j);
            }
        }
    };

    const addNeighbours = (grid) =>{
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j].addneighbours(grid);
            }
        }
    }

    function Spot(i,j){
        this.x = i;
        this.y = j;
        this.isStart = this.x===NODE_START_ROW && this.y===NODE_START_COL;
        this.isEnd = this.x===NODE_END_ROW && this.y===NODE_END_COL;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.neighbours = [];
        this.isWall =false;
       // if(Math.random(1)<0.2){this.isWall=true;}
        //this.onClick=()=>{this.isWall=true;}
        this.previous = undefined;
        this.addneighbours = function(grid){
            let i=this.x;
            let j=this.y;
            //if(this.neighbours.length!==0){return ;}
            if(i>0){this.neighbours.push(grid[i-1][j]);}
            if(i<rows-1){this.neighbours.push(grid[i+1][j]);}
            if(j>0){this.neighbours.push(grid[i][j-1]);}
            if(j<cols-1){this.neighbours.push(grid[i][j+1]);}
        }
    }
    const mouseDown = (row,col) =>{
        isMouseDown=true;
        if(row === NODE_START_ROW && col === NODE_START_COL){clickedOnStart=true;}
        else if(row === NODE_END_ROW && col === NODE_END_COL){clickedOnEnd=true;}
        changeNodetype(row,col);
    }

    const mouseUp = (row,col) =>{
        //changeNodetype(row,col);
        if(clickedOnStart){
            NODE_START_ROW=row;
            NODE_START_COL=col;
            clickedOnStart=false;
        }
        else if(clickedOnEnd){
            NODE_END_ROW=row;
            NODE_END_COL=col;
            clickedOnEnd=false;
        }
        isMouseDown=false;
        //console.log(Grid);
    }

    const changeNodetype = (row,col) => {
        let tempgrid = [];
        Grid.forEach(e => {
            tempgrid.push(e.slice());
        });
        if(!clickedOnStart && !clickedOnEnd && isMouseDown){
            if(Grid[row][col].isWall && !((row===NODE_START_ROW && col===NODE_START_COL)||(row===NODE_END_ROW && col===NODE_END_COL))){
                tempgrid[row][col].isWall=false;
            }
            else{
                if(!((row===NODE_START_ROW && col===NODE_START_COL)||(row===NODE_END_ROW && col===NODE_END_COL))){
                    tempgrid[row][col].isWall=true;
                   // console.log(11);
                }
            }
            //console.log(tempgrid);
            //console.log(Grid);
        }
        if(clickedOnStart){
            tempgrid[row][col].isStart = true;
        }
        else if(clickedOnEnd){
            tempgrid[row][col].isEnd=true;
        }
        setGrid(tempgrid);
    }

    const mouseLeave = (row,col) =>{
        let tempgrid = [];
        Grid.forEach(e => {
            tempgrid.push(e.slice());
        });
        if(clickedOnStart || clickedOnEnd){
            if(tempgrid[row][col].isWall && !((row===NODE_START_ROW && col===NODE_START_COL)||(row===NODE_END_ROW && col===NODE_END_COL))){
                tempgrid[row][col].isStart=false;
                tempgrid[row][col].isEnd=false;
            }
            else if(clickedOnStart && (row===NODE_END_ROW && col===NODE_END_COL)){
                tempgrid[row][col].isEnd=true;
                tempgrid[row][col].isStart=false;
            }else if(clickedOnEnd && (row===NODE_START_ROW && col===NODE_START_COL)){
                tempgrid[row][col].isStart = true;
                tempgrid[row][col].isEnd=false;
            }else{
                //tempgrid[row][col].isWall=false;
                tempgrid[row][col].isEnd=false;
                tempgrid[row][col].isStart = false;
                //console.log(Grid);
            }
        }
        setGrid(tempgrid);
    }
    const  gridwithNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const {isStart,isEnd,isWall} = col;
                            //console.log(isMouseDown,rowIndex,colIndex);
                            return <Node key={colIndex} isStart={isStart}
                            isEnd={isEnd}
                            row={rowIndex} col={colIndex} isWall={isWall}
                             mouseDown = {(rowIndex,colIndex)=>mouseDown(rowIndex,colIndex)}
                             mouseUp = {(rowIndex,colIndex)=>mouseUp(rowIndex,colIndex)} 
                             changeNodeType ={(rowIndex,colIndex)=>changeNodetype(rowIndex,colIndex)}
                             mouseLeave= {(rowIndex,colIndex)=>mouseLeave(rowIndex,colIndex)} />;
                        })}
                    </div>
                )
            })}
        </div>
    );

    const visualizeShortestPath = (shortestpathNodes) => {
        for(let i=0;i<shortestpathNodes.length;i++){
            setTimeout(() => {
                const node = shortestpathNodes[i];
                if(!((node.x===NODE_START_ROW && node.y===NODE_START_COL)||(node.x===NODE_END_ROW && node.y===NODE_END_COL))){
                    document.getElementById(`node-${node.x}-${node.y}`).className="node node-shortest-path";
                }
            }, 10*i)
        }
    }


    const callAstar = ()=> {
        //console.log(Grid);
        let startNode = {...Grid[NODE_START_ROW][NODE_START_COL]};
        let endNode = {...Grid[NODE_END_ROW][NODE_END_COL]};
        let tempg = [];
        Grid.forEach(e => {
            tempg.push(e.slice());
        });
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                const node=tempg[i][j];
                let new_node ={
                    ...node, g: 0, f: 0, h: 0, previous: undefined, neighbours: []
                };
                tempg[i][j]=new_node;
                //console.log(tempg[i][j]);
            }
        }
        //console.log(tempg);
        //createSpot(tempg);
        
        // let tempg = new Array(rows);
        // for(let i=0;i<rows;i++){
        //     tempg[i] = new Array(cols);
        // }
        //createSpot(tempg);
        //console.log(Grid);
        tempg[NODE_START_ROW][NODE_START_COL].isWall=false;
        tempg[NODE_END_ROW][NODE_END_COL].isWall=false;
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                if(!tempg[i][j].isWall  && !(i===NODE_START_ROW && j===NODE_START_COL) && !(i===NODE_END_ROW && j===NODE_END_COL)){
                    document.getElementById(`node-${i}-${j}`).className="node";
                }else if(i===NODE_START_ROW && j===NODE_START_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-start";
                }else if(i===NODE_END_ROW && j===NODE_END_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-end";
                }
            }
        }
        //console.log(Grid);
        
        //restartGrid();
            //console.log(state);
            
            //console.log(Grid);
           // console.log(Grid);
            addNeighbours(tempg);
            //console.log(Grid);
            //console.log(Grid, startNode, endNode);
            //setPath([]);
        // setVisitedNodes([]);
            //console.log(startNode,endNode);
            //console.log(Grid);
            let path = Astar(tempg[NODE_START_ROW][NODE_START_COL],tempg[NODE_END_ROW][NODE_END_COL]);
            //console.log(Grid);
            //console.log(path.path);
            setPath(path.path);
            setVisitedNodes(path.visitedNodes);
            let oldGrid = tempg;
            oldGrid[NODE_START_ROW][NODE_START_COL].isWall=startNode.isWall;
            oldGrid[NODE_END_ROW][NODE_END_COL].isWall=endNode.isWall;
            setGrid(oldGrid);
       
        //console.log("k");
        //console.log(Grid);
        
    }
    const callDijkstra = ()=> {
        //console.log(Grid);
        let startNode = {...Grid[NODE_START_ROW][NODE_START_COL]};
        let endNode = {...Grid[NODE_END_ROW][NODE_END_COL]};
        let tempg = [];
        Grid.forEach(e => {
            tempg.push(e.slice());
        });
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                const node=tempg[i][j];
                let new_node ={
                    ...node, g: 0, f: 0, h: 0, previous: undefined, neighbours: []
                };
                tempg[i][j]=new_node;
                //console.log(tempg[i][j]);
            }
        }
        //console.log(tempg);
        //createSpot(tempg);
        
        // let tempg = new Array(rows);
        // for(let i=0;i<rows;i++){
        //     tempg[i] = new Array(cols);
        // }
        //createSpot(tempg);
        //console.log(Grid);
        tempg[NODE_START_ROW][NODE_START_COL].isWall=false;
        tempg[NODE_END_ROW][NODE_END_COL].isWall=false;
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                if(!tempg[i][j].isWall  && !(i===NODE_START_ROW && j===NODE_START_COL) && !(i===NODE_END_ROW && j===NODE_END_COL)){
                    document.getElementById(`node-${i}-${j}`).className="node";
                }else if(i===NODE_START_ROW && j===NODE_START_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-start";
                }else if(i===NODE_END_ROW && j===NODE_END_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-end";
                }
            }
        }
        //console.log(Grid);
        
        //restartGrid();
            //console.log(state);
            
            //console.log(Grid);
           // console.log(Grid);
            addNeighbours(tempg);
            //console.log(Grid);
            //console.log(Grid, startNode, endNode);
            //setPath([]);
        // setVisitedNodes([]);
            //console.log(startNode,endNode);
            //console.log(Grid);
            let path = Dijkstra(tempg[NODE_START_ROW][NODE_START_COL],tempg[NODE_END_ROW][NODE_END_COL]);
            //console.log(Grid);
            //console.log(path.path);
            setPath(path.path);
            setVisitedNodes(path.visitedNodes);
            let oldGrid = tempg;
            oldGrid[NODE_START_ROW][NODE_START_COL].isWall=startNode.isWall;
            oldGrid[NODE_END_ROW][NODE_END_COL].isWall=endNode.isWall;
            setGrid(oldGrid);
       
        //console.log("k");
        //console.log(Grid);
        
    }
    const callBFS = ()=> {
        //console.log(Grid);
        let startNode = {...Grid[NODE_START_ROW][NODE_START_COL]};
        let endNode = {...Grid[NODE_END_ROW][NODE_END_COL]};
        let tempg = [];
        Grid.forEach(e => {
            tempg.push(e.slice());
        });
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                const node=tempg[i][j];
                let new_node ={
                    ...node, g: 0, f: 0, h: 0, previous: undefined, neighbours: []
                };
                tempg[i][j]=new_node;
                //console.log(tempg[i][j]);
            }
        }
        //console.log(tempg);
        //createSpot(tempg);
        
        // let tempg = new Array(rows);
        // for(let i=0;i<rows;i++){
        //     tempg[i] = new Array(cols);
        // }
        //createSpot(tempg);
        //console.log(Grid);
        tempg[NODE_START_ROW][NODE_START_COL].isWall=false;
        tempg[NODE_END_ROW][NODE_END_COL].isWall=false;
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                if(!tempg[i][j].isWall  && !(i===NODE_START_ROW && j===NODE_START_COL) && !(i===NODE_END_ROW && j===NODE_END_COL)){
                    document.getElementById(`node-${i}-${j}`).className="node";
                }else if(i===NODE_START_ROW && j===NODE_START_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-start";
                }else if(i===NODE_END_ROW && j===NODE_END_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-end";
                }
            }
        }
        //console.log(Grid);
        
        //restartGrid();
            //console.log(state);
            
            //console.log(Grid);
           // console.log(Grid);
            addNeighbours(tempg);
            //console.log(Grid);
            //console.log(Grid, startNode, endNode);
            //setPath([]);
        // setVisitedNodes([]);
            //console.log(startNode,endNode);
            //console.log(Grid);
            let path = BFS(tempg[NODE_START_ROW][NODE_START_COL],tempg[NODE_END_ROW][NODE_END_COL]);
            //console.log(Grid);
            //console.log(path.path);
            setPath(path.path);
            setVisitedNodes(path.visitedNodes);
            let oldGrid = tempg;
            oldGrid[NODE_START_ROW][NODE_START_COL].isWall=startNode.isWall;
            oldGrid[NODE_END_ROW][NODE_END_COL].isWall=endNode.isWall;
            setGrid(oldGrid);
       
        //console.log("k");
        //console.log(Grid);
        
    }
    const callDFS = ()=> {
        //console.log(Grid);
        let startNode = {...Grid[NODE_START_ROW][NODE_START_COL]};
        let endNode = {...Grid[NODE_END_ROW][NODE_END_COL]};
        let tempg = [];
        Grid.forEach(e => {
            tempg.push(e.slice());
        });
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                const node=tempg[i][j];
                let new_node ={
                    ...node, g: 0, f: 0, h: 0, previous: undefined, neighbours: []
                };
                tempg[i][j]=new_node;
                //console.log(tempg[i][j]);
            }
        }
        //console.log(tempg);
        //createSpot(tempg);
        
        // let tempg = new Array(rows);
        // for(let i=0;i<rows;i++){
        //     tempg[i] = new Array(cols);
        // }
        //createSpot(tempg);
        //console.log(Grid);
        tempg[NODE_START_ROW][NODE_START_COL].isWall=false;
        tempg[NODE_END_ROW][NODE_END_COL].isWall=false;
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                if(!tempg[i][j].isWall  && !(i===NODE_START_ROW && j===NODE_START_COL) && !(i===NODE_END_ROW && j===NODE_END_COL)){
                    document.getElementById(`node-${i}-${j}`).className="node";
                }else if(i===NODE_START_ROW && j===NODE_START_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-start";
                }else if(i===NODE_END_ROW && j===NODE_END_COL){
                    document.getElementById(`node-${i}-${j}`).className="node node-end";
                }
            }
        }
        //console.log(Grid);
        
        //restartGrid();
            //console.log(state);
            
            //console.log(Grid);
           // console.log(Grid);
            addNeighbours(tempg);
            //console.log(Grid);
            //console.log(Grid, startNode, endNode);
            //setPath([]);
        // setVisitedNodes([]);
            //console.log(startNode,endNode);
            //console.log(Grid);
            let path = DFS(tempg[NODE_START_ROW][NODE_START_COL],tempg[NODE_END_ROW][NODE_END_COL]);
            //console.log(Grid);
            //console.log(path.path);
            setPath(path.path);
            setVisitedNodes(path.visitedNodes);
            let oldGrid = tempg;
            oldGrid[NODE_START_ROW][NODE_START_COL].isWall=startNode.isWall;
            oldGrid[NODE_END_ROW][NODE_END_COL].isWall=endNode.isWall;
            setGrid(oldGrid);
       
        //console.log("k");
        //console.log(Grid);
        
    }
    const visualizePath = () =>{
       // console.log(Grid);
        for(let i=0;i<=VisitedNodes.length;i++){
           if(i===VisitedNodes.length){
            setTimeout(() => {
                visualizeShortestPath(Path);
            }, 20*i)
           }
           else{
            setTimeout(() => {
                const node = VisitedNodes[i];
                if(!((node.x===NODE_START_ROW && node.y===NODE_START_COL)||(node.x===NODE_END_ROW && node.y===NODE_END_COL))){
                    document.getElementById(`node-${node.x}-${node.y}`).className="node node-visited";
                }
            },20*i)
           }
        }
    }

    //console.log(Path);
    return (
        <div className="wrapper">
            <div className="navbar"> 
            <button className="button button1"onClick={callAstar}>Generate Astar</button>
            <button className="button button3" onClick={callDijkstra}>Generate Dijkstra</button>
            <button className="button button3" onClick={callBFS}>Generate BFS</button>
            <button className="button button3" onClick={callDFS}>Generate DFS</button>
            <button className="button button2" onClick={visualizePath}>Visualize Path</button>
            </div>
            <div>
            <ul class="legend">
						 	<li><span class="start"></span> Starting Node</li>
							<li><span class="end"></span> End Node</li>
							<li><span class="wall"></span> Wall</li>
							<li><span class="visited"></span> Visited Node</li>
							<li><span class="shortest-path"></span> Shortest Node</li>
			</ul>
            </div>
            <br></br><br></br>
            <div className="grid">{gridwithNode}</div>
        </div>
    )
}

export default Pathfind

/*
import React, {useState, useEffect} from 'react'
import Node from './Node'
import Astar from '../astarAlgorithm/astar'
import './Pathfind.css'

const rows = 10;
const cols = 25;

let NODE_START_ROW = 0;
let NODE_START_COL = 0;
let NODE_END_ROW = rows-1;
let NODE_END_COL = cols-1;
let isMouseDown = false;
let clickedOnStart = false;
let clickedOnEnd = false;

const Pathfind = () => {
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [VisitedNodes, setVisitedNodes] = useState([]);

    useEffect(() => {
        initializeGrid();
    }, [])//runs before anything is rendered onto the dom

    const initializeGrid = () => {
        const grid = new Array(rows);
        for(let i=0;i<rows;i++){
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        // const startNode = grid[NODE_START_ROW][NODE_START_COL];
        // const endNode = grid[NODE_END_ROW][NODE_END_COL];
        // startNode.isWall = false;
        // endNode.isWall = false;
        setGrid(grid);
    };

    const createSpot = (grid) => {
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j] = new Spot(i,j);
            }
        }
    };

    const addNeighbours = (grid) =>{
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                grid[i][j].addneighbours(grid);
            }
        }
    }

    function Spot(i,j){
        this.x = i;
        this.y = j;
        this.isStart = this.x===NODE_START_ROW && this.y===NODE_START_COL;
        this.isEnd = this.x===NODE_END_ROW && this.y===NODE_END_COL;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.neighbours = [];
        this.isWall =false;
        this.isVisited = false;
        this.isShortestPath = false;
       // if(Math.random(1)<0.2){this.isWall=true;}
        //this.onClick=()=>{this.isWall=true;}
        this.previous = undefined;
        this.addneighbours = function(grid){
            let i=this.x;
            let j=this.y;
            //if(this.neighbours.length!==0){return ;}
            if(i>0){this.neighbours.push(grid[i-1][j]);}
            if(i<rows-1){this.neighbours.push(grid[i+1][j]);}
            if(j>0){this.neighbours.push(grid[i][j-1]);}
            if(j<cols-1){this.neighbours.push(grid[i][j+1]);}
        }
    }
    const mouseDown = (row,col) =>{
        isMouseDown=true;
        if(row === NODE_START_ROW && col === NODE_START_COL){clickedOnStart=true;}
        else if(row === NODE_END_ROW && col === NODE_END_COL){clickedOnEnd=true;}
        changeNodetype(row,col);
    }

    const mouseUp = (row,col) =>{
        //changeNodetype(row,col);
        if(clickedOnStart){
            NODE_START_ROW=row;
            NODE_START_COL=col;
            clickedOnStart=false;
        }
        else if(clickedOnEnd){
            NODE_END_ROW=row;
            NODE_END_COL=col;
            clickedOnEnd=false;
        }
        isMouseDown=false;
        //console.log(Grid);
    }

    const changeNodetype = (row,col) => {
        let tempgrid = [];
        Grid.forEach(e => {
            tempgrid.push(e.slice());
        });
        if(!clickedOnStart && !clickedOnEnd && isMouseDown){
            if(Grid[row][col].isWall && !((row===NODE_START_ROW && col===NODE_START_COL)||(row===NODE_END_ROW && col===NODE_END_COL))){
                tempgrid[row][col].isWall=false;
            }
            else{
                if(!((row===NODE_START_ROW && col===NODE_START_COL)||(row===NODE_END_ROW && col===NODE_END_COL))){
                    tempgrid[row][col].isWall=true;
                   // console.log(11);
                }
            }
            //console.log(tempgrid);
            //console.log(Grid);
        }
        if(clickedOnStart){
            tempgrid[row][col].isStart = true;
        }
        else if(clickedOnEnd){
            tempgrid[row][col].isEnd=true;
        }
        setGrid(tempgrid);
    }

    const mouseLeave = (row,col) =>{
        let tempgrid = [];
        Grid.forEach(e => {
            tempgrid.push(e.slice());
        });
        if(clickedOnStart || clickedOnEnd){
            if(tempgrid[row][col].isWall && !((row===NODE_START_ROW && col===NODE_START_COL)||(row===NODE_END_ROW && col===NODE_END_COL))){
                tempgrid[row][col].isStart=false;
                tempgrid[row][col].isEnd=false;
            }
            else if(clickedOnStart && (row===NODE_END_ROW && col===NODE_END_COL)){
                tempgrid[row][col].isEnd=true;
                tempgrid[row][col].isStart=false;
            }else if(clickedOnEnd && (row===NODE_START_ROW && col===NODE_START_COL)){
                tempgrid[row][col].isStart = true;
                tempgrid[row][col].isEnd=false;
            }else{
                //tempgrid[row][col].isWall=false;
                tempgrid[row][col].isEnd=false;
                tempgrid[row][col].isStart = false;
                //console.log(Grid);
            }
        }
        setGrid(tempgrid);
    }
    const  gridwithNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return (
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const {isStart,isEnd,isWall,isVisited,isShortestPath} = col;
                            //console.log(isMouseDown,rowIndex,colIndex);
                            return <Node key={colIndex} isStart={isStart}
                            isEnd={isEnd}
                            row={rowIndex} col={colIndex} isWall={isWall}
                            isVisited={isVisited}
                            isShortestPath={isShortestPath}
                             mouseDown = {(rowIndex,colIndex)=>mouseDown(rowIndex,colIndex)}
                             mouseUp = {(rowIndex,colIndex)=>mouseUp(rowIndex,colIndex)} 
                             changeNodeType ={(rowIndex,colIndex)=>changeNodetype(rowIndex,colIndex)}
                             mouseLeave= {(rowIndex,colIndex)=>mouseLeave(rowIndex,colIndex)} />;
                        })}
                    </div>
                )
            })}
        </div>
    );

    const visualizeShortestPath = (shortestpathNodes) => {
        for(let i=0;i<shortestpathNodes.length;i++){
            setTimeout(() => {
                const node = shortestpathNodes[i];
                if(!((node.x===NODE_START_ROW && node.y===NODE_START_COL)||(node.x===NODE_END_ROW && node.y===NODE_END_COL))){
                    //document.getElementById(`node-${node.x}-${node.y}`).className="node node-shortest-path";
                    let tempg=[];
                    Grid.forEach(element => {
                        tempg.push(element.slice());
                    });
                    tempg[node.x][node.y].isShortestPath=true;
                    setGrid(tempg);
                }
            }, 10*i)
        }
    }


    const callAstar = ()=> {
        //console.log(Grid);
        let startNode = {...Grid[NODE_START_ROW][NODE_START_COL]};
        let endNode = {...Grid[NODE_END_ROW][NODE_END_COL]};
        let tempg = [];
        Grid.forEach(e => {
            tempg.push(e.slice());
        });
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                const node=tempg[i][j];
                let new_node ={
                    ...node, g: 0, f: 0, h: 0, previous: undefined, neighbours: []
                };
                tempg[i][j]=new_node;
                //console.log(tempg[i][j]);
            }
        }
        //console.log(tempg);
        //createSpot(tempg);
        
        // let tempg = new Array(rows);
        // for(let i=0;i<rows;i++){
        //     tempg[i] = new Array(cols);
        // }
        //createSpot(tempg);
        //console.log(Grid);
        tempg[NODE_START_ROW][NODE_START_COL].isWall=false;
        tempg[NODE_END_ROW][NODE_END_COL].isWall=false;
        for(let i=0;i<rows;i++){
            for(let j=0;j<cols;j++){
                if(!tempg[i][j].isWall  && !(i===NODE_START_ROW && j===NODE_START_COL) && !(i===NODE_END_ROW && j===NODE_END_COL)){
                    //document.getElementById(`node-${i}-${j}`).className="node";
                    tempg[i][j].isVisited=false;
                    tempg[i][j].isShortestPath=false;
                }else if(i===NODE_START_ROW && j===NODE_START_COL){
                    //document.getElementById(`node-${i}-${j}`).className="node node-start";
                    tempg[i][j].isStart=true;
                }else if(i===NODE_END_ROW && j===NODE_END_COL){
                    //document.getElementById(`node-${i}-${j}`).className="node node-end";
                    tempg[i][j].isEnd=true;
                }
            }
        }
        //console.log(Grid);
        
        //restartGrid();
            //console.log(state);
            
            //console.log(Grid);
           // console.log(Grid);
            addNeighbours(tempg);
            //console.log(Grid);
            //console.log(Grid, startNode, endNode);
            //setPath([]);
        // setVisitedNodes([]);
            //console.log(startNode,endNode);
            //console.log(Grid);
            let path = Astar(tempg[NODE_START_ROW][NODE_START_COL],tempg[NODE_END_ROW][NODE_END_COL]);
            //console.log(Grid);
            //console.log(path.path);
            setPath(path.path);
            setVisitedNodes(path.visitedNodes);
            let oldGrid = tempg;
            oldGrid[NODE_START_ROW][NODE_START_COL].isWall=startNode.isWall;
            oldGrid[NODE_END_ROW][NODE_END_COL].isWall=endNode.isWall;
            setGrid(oldGrid);
       
        //console.log("k");
        //console.log(Grid);
        
    }

    const visualizePath = () =>{
       // console.log(Grid);
        for(let i=0;i<=VisitedNodes.length;i++){
           if(i===VisitedNodes.length){
            setTimeout(() => {
                visualizeShortestPath(Path);
            }, 20*i)
           }
           else{
            setTimeout(() => {
                const node = VisitedNodes[i];
                if(!((node.x===NODE_START_ROW && node.y===NODE_START_COL)||(node.x===NODE_END_ROW && node.y===NODE_END_COL))){
                    //document.getElementById(`node-${node.x}-${node.y}`).className="node node-visited";
                    let tempg=[];
                    Grid.forEach(element => {
                        tempg.push(element.slice());
                    });
                    tempg[node.x][node.y].isVisited=true;
                    setGrid(tempg);
                }
            },20*i)
           }
        }
    }

    //console.log(Path);
    return (
        <div className="wrapper">
            <button className="button button1" onClick={callAstar}>Generate Path</button>
            <button  className="button button2" onClick={visualizePath}>Visualize Path</button>
            <h1>Pathfind Component</h1>
            {gridwithNode}
            <ul class="legend">
						 	<li><span class="start"></span> Starting Node</li>
							<li><span class="end"></span> End Node</li>
							<li><span class="wall"></span> Wall</li>
							<li><span class="visited"></span> Visited Node</li>
							<li><span class="shortest-path"></span> Shortest Node</li>
			</ul>
        </div>
                       
    )
}

export default Pathfind
*/
