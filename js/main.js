'use strict'
const MINE = '💣'
const FLAG = '🚩'
var gLevel = { size: 4, mines: 2 }
var gBoard
var gGame
var gStartTime
var gTimerIntervalId

// localStorage.removeItem('medium')

function onInit() {
    gGame = { isOn: false, shownCount: 0, markedCountDown: 2, secsPassed: 0 }
    stopTimer()
    gBoard = buildBoard(gLevel.size)
    gGame.markedCountDown = gLevel.mines
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
            gBoard[i][j] = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
            // console.log('i, j:', i, j)
        }
    }
    // Temp- place mines at specific location
    // gBoard[0][0].isMine = true
    // gBoard[1][1].isMine = true
    // randMinesIdx(gLevel)      //that is the random mines locating 
    // setMinesNegsCount()

    return gBoard
}

function renderBoard(board) {
    // Render the board as a <table> to the page
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {

        strHTML += '<tr>\n'
        for (var j = 0; j < board.length; j++) {

            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}"
                        data-i="${i}" data-j="${j}"
                        onclick="onCellClick(this,${i},${j})"
                        oncontextmenu="onCellMarked(this,${i},${j})">`

            if (cell.isMarked) {
                strHTML += FLAG
            }
            else if (cell.isShown && cell.isMine) {
                strHTML += MINE
            }
            else if (cell.isShown && !cell.isMine) {
                strHTML += cell.minesAroundCount
            }
        }
        strHTML += '</tr>\n'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
    const elMinesCounter = document.querySelector('.mines-counter')
    elMinesCounter.innerText = gGame.markedCountDown
    /// Best time render
    if (board.length === 4) {
        document.querySelector(".best-time").innerText = localStorage[4]
    }
    else if (board.length === 8) {
        document.querySelector(".best-time").innerText = localStorage[8]
    }
    else if (board.length === 12) {
        document.querySelector(".best-time").innerText = localStorage[12]
    }
}

function checkGameOver() {
    if (gGame.markedCountDown === 0 && gGame.shownCount === ((gBoard.length ** 2) - gLevel.mines)) {
        gameOver('win')
    }
}

function gameOver(res) {
    console.log(res)
    stopTimer()
    gGame.isOn = false
    var restartIcon = document.querySelector('.restart button')
    if (res === 'win') {
        restartIcon.innerText = '😎'
        bestScore()
    }
    else restartIcon.innerText = '🤯'
}

function bestScore() {
    if (gGame.secsPassed === 0) return
    var record = + localStorage[gLevel.size]
    if (!localStorage[gLevel.size] || (gGame.secsPassed < record)) {
        localStorage[gLevel.size] = gGame.secsPassed
    }
}

function restart() {
    document.querySelector('.timer').innerText = '000'
    document.querySelector('.restart button').innerText = '😃'
    onInit()
}

function randMinesIdx(gLevel, i, j) {
    var n = gLevel.mines
    console.log('i,j:', i, j)
    while (n > 0) {
        var rndI = getRandomInt(0, gLevel.size)
        var rndJ = getRandomInt(0, gLevel.size)
        if (gBoard[rndI][rndJ].isMine) continue
        if ((rndI >= i - 1 && rndJ <= j + 1) && (rndI <= i + 1 && rndJ >= j - 1)) continue
        console.log('rndI, rndJ:', rndI, rndJ)
        gBoard[rndI][rndJ].isMine = true
        n--
    }
}

function onCellClick(elCell, i, j) {
    if (gBoard[i][j].isMarked === true) return
    if (!gGame.isOn && gGame.secsPassed !== 0) return
    if (!gGame.isOn && gGame.secsPassed === 0) {
        gGame.isOn = true
        startTimer()
        // gBoard[0][0].isMine = true
        // gBoard[1][1].isMine = true
        console.log('now')
        randMinesIdx(gLevel, i, j)
        setMinesNegsCount()
    }
    if (gBoard[i][j].isMine) {
        console.log('You lost!')
        gBoard[i][j].isShown = true
        gameOver('loss')
        revealAllMines()
    }
    else if (gBoard[i][j].minesAroundCount === 0) {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        checkGameOver()
        expandShown(gBoard, elCell, i, j)
    }
    else {
        gBoard[i][j].isShown = true
        gGame.shownCount++
        checkGameOver()
    }
    renderBoard(gBoard)
}

function onCellMarked(elCell, i, j) {
    if (!gGame.isOn && gGame.secsPassed !== 0) return
    if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = true
        gGame.markedCountDown--
        renderBoard(gBoard)
        checkGameOver()
    }
    else if (!gBoard[i][j].isShown && gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false
        gGame.markedCountDown++
        renderBoard(gBoard)
    }
}

function expandShown(gBoard, elCell, i, j) {
    var cellIdx = { i, j }
    for (var i = cellIdx.i - 1; i <= cellIdx.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellIdx.j - 1; j <= cellIdx.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellIdx.i && j === cellIdx.j) continue
            var currCell = gBoard[i][j]
            if (currCell.isMarked) continue
            if (currCell.isShown) continue
            if (currCell.minesAroundCount === 0) {
                onCellClick(elCell, i, j)
            }
            else {
                gBoard[i][j].isShown = true
                gGame.shownCount++
                renderBoard(gBoard)
                checkGameOver()
            }
        }
    }
}

function setMinesNegsCount() {
    // Count mines around each cell and set the cell's minesAroundCount. Attention- mine cells also count negs.
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var cellIdx = { i, j }
            var cellMinesNgsCount = minesAroundCount(cellIdx)
            gBoard[i][j].minesAroundCount = cellMinesNgsCount
        }
    }
}

function minesAroundCount(cellIdx) {
    var minesNgsCount = 0
    for (var i = cellIdx.i - 1; i <= cellIdx.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellIdx.j - 1; j <= cellIdx.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === cellIdx.i && j === cellIdx.j) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) minesNgsCount++
        }
    } return minesNgsCount
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMine === true) {
                currCell.isShown = true
            }
        }
    }
}

function selectLevel(level) {
    gLevel = level
    restart()
}

function startTimer() {
    gStartTime = Date.now();
    gTimerIntervalId = setInterval(updateTimer, 10)
}

function stopTimer() {
    clearInterval(gTimerIntervalId)
}

function updateTimer() {
    var elapsedTime = Date.now() - gStartTime;
    var seconds = Math.floor((elapsedTime / 1000))
    document.querySelector('.timer').innerText = formatTime(seconds)
    gGame.secsPassed = seconds
}

function formatTime(time) {
    if (time < 10) return '00' + time
    else if ((time >= 10 && time < 100)) return '0' + time
    else return time
}