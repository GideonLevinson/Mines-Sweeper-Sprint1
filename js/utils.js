'use strict'



function getEmptyPosRandom() {
    const emptyLocations = []
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j]
            if (cell.type === FLOOR && !cell.gameElement) emptyLocations.push({ i, j })
        }
    }
    const randIdx = getRandomInt(0, emptyLocations.length)
    var emptyPos = (emptyLocations[randIdx]) ? emptyLocations[randIdx] : null

    return emptyPos
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function renderScore() {
    var elSpan = document.querySelector('.score span')
    elSpan.innerHTML = gCollectedBalls
}

function renderNgs() {
    var elSpan = document.querySelector('.ngs span')
    elSpan.innerHTML = gNgsCount
}

function countNgs() {
    var cellI = gGamerPos.i
    var cellJ = gGamerPos.j
    var ngsCount = 0
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= gBoard[i].length) continue
            if (gBoard[i][j].gameElement === BALL) ngsCount++
        }
    }
    gNgsCount = ngsCount
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'
    var color = '#'
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
    }
    return color
}