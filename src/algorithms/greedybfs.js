function Astar(startNode,endNode,Grid,rows,cols)
{   /*for(let i=0;i<rows;i++){
        for(let j=0;j<cols;j++){
            Grid[i][j].f=0;
            Grid[i][j].g=0;
            Grid[i][j].h=0;
        }
    }*/
    //console.log(Grid);
    
    let openSet=[];
    let closedSet=[];
    let path=[];
    let visitedNodes=[];
    
    openSet.push(startNode);
    while(openSet.length>0)
    {
        let leastIndex=0;
        for(let i=0;i<openSet.length;i++){
            if(openSet[i].f<openSet[leastIndex].f){
                  leastIndex=i;
            }
        }
        let current=openSet[leastIndex];
        visitedNodes.push(current);
        if(current===endNode)
        {   
            let temp=current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp=temp.previous;
            }
            //console.log(path);
            return {path,visitedNodes};
            //console.log("Done! Path Found!");
        }
        openSet=openSet.filter((elt)=>elt!==current);
        closedSet.push(current);

        let neighbours=current.neighbours;
        for(let i=0;i<neighbours.length;i++){
            let neighbour=neighbours[i];
            if(!closedSet.includes(neighbour) && !neighbour.isWall){
                let tempG=current.g+1;
                let newPath=false;
                if(openSet.includes(neighbour)){
                    if(tempG<neighbour.g){
                        neighbour.g=tempG;
                        newPath=true;
                    }
                }else{
                    neighbour.g=tempG;
                    newPath=true;
                    openSet.push(neighbour);
                }
                if(newPath)
                {
                    neighbour.h=heuristic(neighbour,endNode);
                    neighbour.f=neighbour.h;
                    neighbour.previous=current;
                }
            }

        }
    }
    return{path,visitedNodes,error:"No Path found!"};
}

function heuristic(a,b){
    let d=Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
    return d;
}
export default Astar;