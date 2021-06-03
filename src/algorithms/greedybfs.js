// User defined class
// to store element and its priority
class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}
 
// PriorityQueue class
class PriorityQueue {
    // An array is used to implement priority
    constructor()
    {
        this.items = [];
    }
 
    // functions to be implemented
    // enqueue(item, priority)
    // enqueue function to add element
    // to the queue as per priority
    enqueue(element, priority){
    // creating object from queue element
    var qElement = new QElement(element, priority);
    var contain = false;
 
    // iterating through the entire
    // item array to add element at the
    // correct location of the Queue
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].priority > qElement.priority) {
            // Once the correct location is found it is
            // enqueued
            this.items.splice(i, 0, qElement);
            contain = true;
            break;
        }
    }
 
    // if the element have the highest priority
    // it is added at the end of the queue
    if (!contain) {
        this.items.push(qElement);
    }
    }
    // dequeue()
    // dequeue method to remove
    // element from the queue
    dequeue()
    {
    // return the dequeued element
    // and remove it.
    // if the queue is empty
    // returns Underflow
    if (this.isEmpty())
        return "Underflow";
    return this.items.shift();
    }
    // front()
    // front function
    front()
    {
    // returns the highest priority element
    // in the Priority queue without removing it.
    if (this.isEmpty())
        return "No elements in Queue";
    return this.items[0];
    }
    // rear function
    rear()
    {
    // returns the lowest priority
    // element of the queue
    if (this.isEmpty())
        return "No elements in Queue";
    return this.items[this.items.length - 1];
    }
    // isEmpty()
    // isEmpty function
    isEmpty()
    {
    // return true if the queue is empty.
    return this.items.length == 0;
    }
    // printPQueue()
    // printQueue function
    // prints all the element of the queue
    printPQueue()
    {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
        str += this.items[i].element + " ";
    return str;
    }
}

// creating object for queue classs
var priorityQueue = new PriorityQueue();
 
 
// adding elements to the queue
priorityQueue.enqueue("Sumit", 2);
priorityQueue.enqueue("Gourav", 1);
priorityQueue.enqueue("Piyush", 1);
priorityQueue.enqueue("Sunny", 2);
priorityQueue.enqueue("Sheru", 3);
 
// prints [Gourav Piyush Sumit Sunny Sheru]
console.log(priorityQueue.printPQueue());
 
// prints Gourav
console.log(priorityQueue.front().element);
 
// pritns Sheru
console.log(priorityQueue.rear().element);
 
// removes Gouurav
// priorityQueue contains
// [Piyush Sumit Sunny Sheru]
console.log(priorityQueue.dequeue().element);
 
// Adding another element to the queue
priorityQueue.enqueue("Sunil", 2);
 
// prints [Piyush Sumit Sunny Sunil Sheru]
console.log(priorityQueue.printPQueue());


function BFS(startNode, endNode){
    let openSet=new PriorityQueue();
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