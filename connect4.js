"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

let WIDTH = 7;
let HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for (let y = 0; y < HEIGHT; y++) {
    let boardRow = [];
    for (let x = 0; x < WIDTH; x++) {
      // Didn't set an array to be pushed into board
      // let boardCell = board[i][j];
      // boardCell = null;
      boardRow.push(null);
    }
    board.push(boardRow);
    //console.log(board);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  let htmlBoard = document.getElementById("board");

  // TODO: add comment for this code
  // For the top row, add an ID called 'column-top' with a click handler
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // TODO: add comment for this code
  // Loop width number of times and create a table-data with name of head cell
  // Assign an ID equal to number of iterations
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    // TODO: Create a table row element and assign to a "row" variable
    let row = document.createElement("tr");

    for (let x = 0; x < WIDTH; x++) {
      // TODO: Create a table cell element and assign to a "cell" variable
      let cell = document.createElement("td");

      // TODO: add an id, y-x, to the above table cell element
      // you'll use this later, so make sure you use y-x
      cell.setAttribute("id", `${y}-${x}`);

      // TODO: append the table cell to the table row
      row.append(cell);
    }
    // TODO: append the row to the html board
    htmlBoard.append(row);

  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */
//Input is the x (width) coordinate.
//Functions find the lowest empty spot in the game board and returns the y (height) coordinate
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 5
  //Error: does not register end column and skip a row.
  for(let y = HEIGHT-1; y >= 0; y--){
    //change made as y is the height or which row we are on and x is the width or 
    //the elements we are on
    if(board[y][x] === null){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  let circlePiece = document.createElement("div");
  circlePiece.setAttribute("class", "piece");
  circlePiece.classList.add(`p${currPlayer}`);
  let correctCell = document.getElementById(`${y}-${x}`);
  correctCell.append(circlePiece);
  correctCell.setAttribute("class", `p${currPlayer}`);
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
  return "Tie Game";
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  let result = false;
  for (let y = 0; y < HEIGHT; y++) {
    if (board[y].every(cell => cell !== null)) {
      result = true;
    } else {
      result = false;
      break;
    }
  }
  if (result = true) {
    endGame();
  }
  // switch players
  // TODO: switch currPlayer 1 <-> 2
  //assign background color - assigning 
  currPlayer = (currPlayer === 2) ? 1 : 2
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    let compareCell = cells[0][0];
    let connectWinner = board[compareCell[0]][compareCell[1]];
    let winnerExists = false;
    for(let i = 0; i < cells.length;i++){
      let yCell = cells[i][0];
      let xCell = cells[i][1];
      if(board[yCell][xCell] === connectWinner){
        winnerExists = true;
      }else{
        winnerExists = false;
        break;
      }
    }
    return `Player ${currPlayer} WINS!!!`;
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y,x],[y+1,x],[y+2,x][y+3,x]];
      //diagDownLeft
      let diagDL = [[y,x],[y-1,x-1],[y-2,x-2],[y-3,x-3]];
      let diagDR = [[y,x],[y-1,x+1],[y-2,x+2],[y-3,x+3]];;

      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
