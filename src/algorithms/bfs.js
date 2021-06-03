function BFS(startNode, endNode){
    let openSet=[];
    let closedSet=[];
    let path=[];
    let visitedNodes=[];
    openSet.unshift(startNode);
    while(openSet.length>0)
    {
          let current=openSet.pop();
          if(!closedSet.includes(current)){
          closedSet.push(current);
          if(current===endNode){
            let temp=current;
            path.push(temp);
            while(temp.previous){
                path.push(temp.previous);
                temp = temp.previous;
            }
            console.log(path);
            return {path, visitedNodes};
          }else{
            visitedNodes.push(current);
          }
          let neighbours=current.neighbours;
          for(let i=0;i<neighbours.length;i++){
              if(!closedSet.includes(neighbours[i]) && !neighbours[i].isWall){
                  neighbours[i].previous=current;
                  openSet.unshift(neighbours[i]);
              }
          }
        }else{
            
        }  
    }

    return {path,visitedNodes, error:"No Path Found!"};
}


export default BFS;

