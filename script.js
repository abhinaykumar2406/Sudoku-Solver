let mainSudokugrid=[];
let gridCells=document.querySelectorAll(".gridCells");
function submitSudoku() {
    let sudokuGrid = [];
    for (let i = 0; i < 9; i++) {
        sudokuGrid[i] = [];
        for (let j = 0; j < 9; j++) {
            let cellValue = document.getElementById('cell-' + i + '-' + j).value;
            sudokuGrid[i][j] = cellValue ? parseInt(cellValue) : 0; // Default to 0 if the cell is empty
        }
    }
    if(!validateSudoku(sudokuGrid)){
        alert("Sudoku is Not Valid");
        return false;
    }
    else{
        mainSudokugrid=sudokuGrid;
        console.log(mainSudokugrid);
        return true;
    }
}

function validateSudoku(grid) {
    return validateRows(grid) && validateColumns(grid) && validateSubgrids(grid);
}

function validateRows(grid) {
    for (let row = 0; row < 9; row++) {
        let seen = new Set();
        for (let col = 0; col < 9; col++) {
            let value = grid[row][col];
            if(!(value>=0 && value<=9)){
                return false;
            }
            if (value !== 0) {
                if (seen.has(value)) {
                    return false;
                }
                seen.add(value);
            }
        }
    }
    return true;
}

function validateColumns(grid) {
    for (let col = 0; col < 9; col++) {
        let seen = new Set();
        for (let row = 0; row < 9; row++) {
            let value = grid[row][col];
            if(value<0 || value>9){
                return false;
            }
            if (value !== 0) {
                if (seen.has(value)) {
                    return false;
                }
                seen.add(value);
            }
        }
    }
    return true;
}

function validateSubgrids(grid) {
    for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
            let seen = new Set();
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    let value = grid[boxRow * 3 + row][boxCol * 3 + col];
                    if(value<0 || value>9){
                        return false;
                    }
                    if (value !== 0) {
                        if (seen.has(value)) {
                            return false;
                        }
                        seen.add(value);
                    }
                }
            }
        }
    }
    return true;
}

function solveSudokufunc(board) {
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(board[i][j] === 0){
                for(let k=1; k<=9 ; k++){                   
                    const num = k;
                    // document.getElementById('cell-' + i + '-' + j).value = num;
                    if(isNumValid(i,j,num,board)){
                        board[i][j] = num;
                        if(solveSudokufunc(board) === true){
                            return true;
                        }else{
                            board[i][j] = 0;
                            // document.getElementById('cell-' + i + '-' + j).value = "";
                        }   
                    }
                }
                return false;
            } 
        }
    }
    return true;
}

function isNumValid(row, col, num, board){
    for(let i=0 ; i<9 ; i++){        
        if(board[row][i] === num) 
            return false;        
        if(board[i][col] === num) 
            return false;     
    }
    let subgridpos = Math.floor(row / 3) * 3 + Math.floor(col / 3);
    let rowcheck = Math.floor(subgridpos / 3) * 3;
    let colcheck = (subgridpos % 3) * 3;
    for(let i = rowcheck; i < rowcheck + 3; i++){
        for(let j = colcheck; j < colcheck+3 ; j++){
            if(!(i===row && j===col)){
                if(board[i][j] === num)
                    return false;
            }
        }
    }
    return true;
}
const displayCell=(i,j)=>{
    return new Promise((resolve,reject)=>{
        let obj = document.getElementById('cell-' + i + '-' + j);
        if(obj.value!=""){
            resolve(200);
            return;
        }
        setTimeout(() => {
            if(obj.value==""){
                document.getElementById('cell-' + i + '-' +  j).value=mainSudokugrid[i][j];
                obj.style.color = "blue";
            }
            resolve(200);
        }, 100);
    });
}
async function solveSudoku(){
    if(!submitSudoku())
        return;
    let isSolve = solveSudokufunc(mainSudokugrid);
    if(isSolve===true){
        document.getElementById("solveBut").disabled = true;
        document.getElementById("resetBut").disabled = true;
        document.getElementById("submitBut").disabled = true;
        console.log(mainSudokugrid);
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                await displayCell(i,j);
            }
        }
        document.getElementById("solveBut").disabled = false;
        document.getElementById("resetBut").disabled = false;
        document.getElementById("submitBut").disabled = false;        
    }
    else{
        alert("No solution find");
    }
}


function resetSudoku(){
    for(let row=0;row<9;row++){
        for(let col=0;col<9;col++){
            // mainSudokugrid[row][col]=0;
            document.getElementById('cell-' + row + '-' + col).style.color = "black";
            document.getElementById('cell-' + row + '-' + col).value = "";
        }
    }
}
