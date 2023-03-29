'use strict'
const MINE = '💣'
const FLAG = '🚩'
var gLevel = { size: 4, mines: 2 }
var gBoard
var gGame = { isOn: false, shownCountL: 0, markedCount: 0, secsPassed: 0 }

function onInit() {

    gBoard = buildBoard(gLevel.size)
    console.log('gBoard:', gBoard)
    renderBoard(gBoard)

}

function buildBoard(size) {
    // Builds the board
    // Set the mines
    // Call setMinesNegsCount() 
    // Return the created board   

    gBoard = []
    for (var i = 0; i < size; i++) {
        gBoard[i] = []
        for (var j = 0; j < size; j++) {
            gBoard[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: true }
            // console.log('i, j:', i, j)
        }
    }
    // Temp- place mines at specific location
    gBoard[1][1].isMine = true
    gBoard[2][2].isMine = true
    console.log('gBoard:', gBoard)
    setMinesNegsCount()

    return gBoard
}


function renderBoard(board) {
    // Render the board as a <table> to the page
    console.log('board:', board)
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'
        for (var j = 0; j < board.length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}"
                        data-i="${i}" data-j="${j}"
                        onclick="onCellClick(this,${i},${j})"
                        oncontextmenu="onCellMarked(this,${i},${j})"></td>` // cell content was ${cell}
        }
        strHTML += '</tr>\n'
    }

    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function onCellClick(elCell, i, j) {
    console.log('elCell:', elCell)
    console.log('i,j:', i,j)
}

function onCellMarked(elCell, i, j) {   //elCell, i, j
   console.log('i,j:', i,j)
}

function checkGameOver(){
// ToDo: Game ends when all mines are marked, and all the other cells are shown  
}

function expandShown(board, elCell, i, j){

}

function setMinesNegsCount() {
    // Count mines around each cell and set the cell's minesAroundCount. Attention- mine cells also count negs.
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cellIdx = { i, j }
            // console.log('cellIdx:', cellIdx)
            var cellMinesNgsCount = minesAroundCount(cellIdx)
            // console.log('cellMinesNgsCount:', cellMinesNgsCount)
            gBoard[i][j].minesAroundCount = cellMinesNgsCount
        }
    }
}

function minesAroundCount(cellIdx) {
    console.log('cellIdx[0]:', cellIdx[0])
    var minesNgsCount = 0
    for (var i = cellIdx.i - 1; i <= cellIdx.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellIdx.j - 1; j <= cellIdx.j + 1; j++) {
            console.log('i,j:', i, j)
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellIdx.i && j === cellIdx.j) continue
            var currCell = gBoard[i][j]
            console.log('currCell:', currCell)
            if (currCell.isMine) minesNgsCount++
            console.log('minesNgsCount:', minesNgsCount)
        }
    } return minesNgsCount
    // var elNgsCount = document.querySelector('.negs-count span')
    // elNgsCount.innerText = negsCount
}