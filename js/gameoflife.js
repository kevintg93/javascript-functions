function seed(...arg) {return arg;}

function same([x, y], [j, k]) {
  cell1= [x,y];
  cell2=[j,k];
  let result = cell1.every(element=> cell2.includes(element));
  return result;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  let y=[];
      let z=[];
      g=this;
      g.forEach(element => { 
        let temp = JSON.stringify(element)===JSON.stringify(cell);
        if(temp===true){
            y.push(temp);
            z=element
        }else{
          y.push(temp);
        }
      })
     let val= y.filter(x=>x===true);
      if(val[0]===true){
          return z;
      }else{return undefined}
}


const printCell = (cell, state) => {
  let value = contains.call(state,cell)
    if (value !== undefined){
      return '\u25A3';
    }
    else{
      return '\u25A2';
    }
};

const corners = (state = []) => {
  let xAxis=[];
  let yAxis=[];
  state.forEach(element=>{
    xAxis.push(element[0])
  });
  state.forEach(element=>{
    yAxis.push(element[1])
  });
  let topRight =[Math.max(...xAxis), Math.max(...yAxis)];
  let bottomLeft =[Math.min(...xAxis), Math.min(...yAxis)];
  if(state[0]!== undefined){
    return {'topRight':topRight,'bottomLeft':bottomLeft}
  }else{
    return {'topRight':[0,0],'bottomLeft':[0,0]}
  }
};

const printCells = (state) => {
  let cornersValue= corners(state);
  let bottomLeft =cornersValue.bottomLeft;
  let topRight=cornersValue.topRight; 
  let grid=[]
 
 for(y=bottomLeft[1];y<=topRight[1];y++){
     for(x=topRight[0];x>=bottomLeft[0];x--){
             grid.push([x,y]);
         }
     }
     reverseGrid=grid.reverse()
     let cellGrid=[];
     reverseGrid.forEach(element=>{
       cellGrid.push(printCell(element,state));
       })
       for (i=0;i<cellGrid.length;i++){
         if(i<cellGrid.length){
           i=i+3
           cellGrid.splice(i,0,'\n')
         }
       }
       return cellGrid.join(' ')
};

const getNeighborsOf = ([x, y]) => {
  var list = []
  for (var i = (x-1); i <= (x+1); i++) {
    for (var j = (y-1); j <= (y+1); j++) {
    list.push([i,j]);
    }
}
list = list.filter(element=> JSON.stringify(element) !== JSON.stringify([x,y]) )
return list
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);
  let livingCells=[];
  neighbors.forEach(element=>{
    let aliveCells = contains.bind(state);
    livingCells.push(aliveCells(element));
  })
  return livingCells.filter(x=>x!==undefined);
};

const willBeAlive = (cell, state) => {
  let livingNeighbors = getLivingNeighbors(cell,state);
  let aliveCell = contains.bind(state)
  if(livingNeighbors.length===3 || aliveCell!== undefined && livingNeighbors.length===2){
    return cell
  }
};

const calculateNext = (state) => {
  let grid= corners(state)
  
   grid.topRight.forEach((t,index)=> grid.topRight[index] = t+1);
   grid.bottomLeft.forEach((s,index)=> grid.bottomLeft[index] = s-1);
   let newGameState=[]
   for(y=grid.bottomLeft[1];y<=grid.topRight[1];y++){
    for(x=grid.topRight[0];x>=grid.bottomLeft[0];x--){
            newGameState.push([x,y]);
        }
    }
    let newLiveCell= newGameState.filter(element=>{ 
      return (willBeAlive(element,state) !== undefined);
    })
    return newLiveCell;
};

const iterate = (state, iterations) => {
  let gameStates=[];
  gameStates.push(state)
  for(i=0;i<iterations;i++){
    let temp = calculateNext(gameStates[i]);
    gameStates.push(temp)
  }
  return gameStates;
};

const main = (pattern, iterations) => {
  let gameStates=iterate(pattern,iterations);
  let design =''
  gameStates.forEach(element=>{ 
    design += '\n' + printCells(element);
  })
  return design;
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;