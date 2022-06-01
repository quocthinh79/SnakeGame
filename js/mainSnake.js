let getVariable = getComputedStyle(document.documentElement)

let sizeX = Number.parseInt(getVariable.getPropertyValue('--variable-sizeX'))
let sizeY = Number.parseInt(getVariable.getPropertyValue('--variable-sizeY'))


let bodySnake = []

let foodPosition = {}

let wall = []

let rock = {}

let gift = {}

let newLocalRock = {x: 1, y: 0}


let newLocal = {x: 0, y: 0}
let lastLocal = {x: 1, y: 0}
let score = 0;
let nextLevelCount = 1;
const gameBoard = $('.game-main')
const SWAP_LEVEL = 10
let scoreHigh = $('.score-high')
let popUpGameOver = $('.popup-game-over')
let btnAccept = $('.accept')
let btnDeny = $('.deny')
let futureScore = 0;
let nextLevel = $('.swap-level')
let count = 0;
let newScore = 0;
let levelLabel = $('.level')
let scoreLabel = $('.score')
let btnNewGame = $('.btn-new-game')
let popupNewGame = $('.popup-new-game')
let chooseLevel = $('.choose-level')
let displayChooseLevel = $('.display-choose-level')
let goBack = $('.go-back')
let level = $('.btn-level')
let highestScore = $('.highest-score')
let highestScoreNewGame = $('.highest-score-new-game')
let goMenu = $('.go-menu')
let giftLabel = $('.gift')
let giftString = "Nothing"
let checkGift;
let lastNumberRand = []


let interval = setInterval(main, 250)

// Set up wall
const setUpArrWallLevel1 = () => {
    for (let i = 1; i <= sizeX; i++) {
        for (let j = 1; j <= sizeY; j++) {
            if ((i === 1 || i === sizeX) || (j === 1 || j === sizeY)) {
                wall.push({x: i, y: j})
            }
        }
    }
}

const setUpArrWallLevel2 = () => {
    let sizeWallX = Math.round(sizeX / 5);
    let sizeWallY = Math.round(sizeY / 5);

    /*Bốn thanh dọc*/
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            if ((j === sizeWallY || j === sizeWallY * 3 + 2) && (i === sizeWallX || i === sizeWallX * 4 + 2)) {
                for (let k = 0; k <= sizeWallX; k++) {
                    wall.push({x: i, y: j++})
                }
            }
        }
    }

    /*Hai ngang trên*/
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            if ((i === sizeWallY || i === sizeWallY * 3 + 2) && (j === sizeWallX || j === sizeWallX * 4 + 2)) {
                for (let k = 0; k <= sizeWallX; k++) {
                    wall.push({x: i++, y: j})
                }
            }
        }
    }

    /*Hai ngang dưới*/
    for (let i = 0; i < sizeY; i++) {
        for (let j = 0; j < sizeX; j++) {
            if ((i === sizeWallY || i === sizeWallY * 3 + 2) && (j === sizeWallX * 4 + 2)) {
                for (let k = 0; k <= sizeWallX; k++) {
                    wall.push({x: i++, y: j})
                }
            }
        }
    }
}

const setUpArrWallLevel3 = () => {
    for (let i = 1; i <= sizeX; i++) {
        for (let j = 1; j <= sizeY; j++) {
            if ((((j === 7) || (j === sizeX - 6)) && (i >= 3) && (i <= sizeY - 2))) {
                wall.push({x: i, y: j})
            }
            if ((((j === 10) || (j === sizeX - 9)) && (i >= 6) && (i <= sizeY - 5))) {
                wall.push({x: i, y: j})
            }
        }
    }
}


function nextLevelFunc() {
    lastNumberRand = []
    clearInterval(interval)
    gift = {}
    nextLevel.css("display", "flex");
    gameBoard.css("display", "none");
    setTimeout(function () {
        nextLevel.css("display", "none");
        gameBoard.css("display", "grid");
        interval = setInterval(main, 250)
    }, 1000)
}

function setUpNewGame() {
    futureScore = score + SWAP_LEVEL;
    if (nextLevelCount >= 3) {
        rock = {x: randomInTheRange(1, sizeX), y: randomInTheRange(1, sizeY)}
    } else {
        rock = {}
    }
    switch (nextLevelCount) {
        case 1:
            nextLevelCount = 2
            wall = []
            setNewGame()
            nextLevelFunc()
            break;
        case 2:
            nextLevelCount = 3
            wall = []
            setUpArrWallLevel2()
            setNewGame()
            nextLevelFunc()
            break;
        case 3:
            nextLevelCount = 4
            wall = []
            setUpArrWallLevel1()
            setNewGame()
            nextLevelFunc()
            break
        case 4:
            nextLevelCount = 5
            wall = []
            setUpArrWallLevel3()
            setNewGame()
            nextLevelFunc()
            break
        case 5:
            nextLevelCount = 6
            wall = []
            setUpArrWallLevel1()
            setUpArrWallLevel2()
            setNewGame()
            nextLevelFunc()
            break
        case 6:
            nextLevelCount = 7
            wall = []
            setUpArrWallLevel2()
            setUpArrWallLevel3()
            setNewGame()
            nextLevelFunc()
            break
        case 7:
            nextLevelCount = 8
            wall = []
            setUpArrWallLevel1()
            setUpArrWallLevel2()
            setUpArrWallLevel3()
            setNewGame()
            nextLevelFunc()
            break
    }
}

function generateRandomX(min = 2, max = sizeX - 1) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand += min;
    return rand;
}

function generateRandomY(min = 2, max = sizeY - 1) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand += min;
    return rand;
}


function randomSetUpPosition(...element) {
    let randX = generateRandomX();
    let randY = generateRandomY();
    for (const x of element) {
        if (Array.isArray(x)) {
            x.map(segment => {
                if ((randX === segment.x) && (randY === segment.y)) {
                    randX = randomSetUpPosition(segment, segment.x, x, ...element).x
                    randY = randomSetUpPosition(segment, segment.y, x, ...element).y
                }
            })
        } else {
            if ((randX === x.x) && (randY === x.y)) {
                randX = randomSetUpPosition(x, ...element).x
                randY = randomSetUpPosition(x, ...element).y
            }
        }
    }
    return {x: randX, y: randY};
}

const setNewGame = () => {
    lastNumberRand = []
    newLocal = {x: 0, y: 0}
    // Set up food
    foodPosition = randomSetUpPosition(wall)
    // Random position snake
    bodySnake = []
    bodySnake[0] = randomSetUpPosition(wall, foodPosition)
}

setNewGame();

function randomInTheRangeNotRepeat(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let rand = Math.floor(step2) + min;
    if (lastNumberRand.length === max) {
        lastNumberRand = []
    }
    if (lastNumberRand.includes(rand)){
        randomInTheRange(min, max)
    } else {
        lastNumberRand.push(rand)
    }
    return rand;
}


function randomInTheRange(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let rand = Math.floor(step2) + min;
    return rand;
}

function rockMove() {
    if (rock.x >= sizeX) {
        newLocalRock = {x: randomInTheRange(-1, -1), y: randomInTheRange(-1, 1)}
    }

    if (rock.x < 1) {
        newLocalRock = {x: randomInTheRange(1, 1), y: randomInTheRange(-1, 1)}
    }

    if (rock.y >= sizeY) {
        newLocalRock = {x: randomInTheRange(-1, 1), y: randomInTheRange(-1, -1)}
    }

    if (rock.y < 1) {
        newLocalRock = {x: randomInTheRange(-1, 1), y: randomInTheRange(1, 1)}
    }
    rock.x += newLocalRock.x
    rock.y += newLocalRock.y
}


const checkNotWall = () => {
    if (bodySnake[0].x > sizeX) {
        bodySnake[0].x = 1
    }
    if (bodySnake[0].x === 0) {
        bodySnake[0].x = sizeX
    }
    if (bodySnake[0].y > sizeY) {
        bodySnake[0].y = 1
    }
    if (bodySnake[0].y === 0) {
        bodySnake[0].y = sizeY
    }
}

const setUpRock = (gameBoard) => {
    const rockElement = document.createElement('div')
    rockElement.style.gridRowStart = rock.y
    rockElement.style.gridColumnStart = rock.x
    rockElement.style.backgroundImage = "url('/image/rock.png')"
    rockElement.style.backgroundPosition = "center"
    rockElement.style.backgroundSize = "contain"
    rockElement.style.backgroundRepeat = "no-repeat"
    gameBoard.append(rockElement)
}
const giftElement = document.createElement('div')

const setUpGift = (gameBoard) => {
    giftElement.style.gridRowStart = gift.y
    giftElement.style.gridColumnStart = gift.x
    giftElement.style.backgroundPosition = "center"
    giftElement.style.backgroundSize = "contain"
    giftElement.style.backgroundRepeat = "no-repeat"
    gameBoard.append(giftElement)
}

const setUpSnake = (gameBoard) => {
    bodySnake.map((snake, count) => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = snake.y
        snakeElement.style.gridColumnStart = snake.x
        if (count === 0) {
            snakeElement.style.backgroundColor = "green"
        } else {
            snakeElement.style.backgroundColor = "#39b54a"
        }
        gameBoard.append(snakeElement)
    })
}

const updateSnake = () => {
    lastLocal = newLocal
    for (let index = bodySnake.length - 2; index >= 0; index--) {
        bodySnake[index + 1] = {...bodySnake[index]}
    }
    bodySnake[0].x += newLocal.x
    bodySnake[0].y += newLocal.y
}

const setUpFood = (gameBoard) => {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = foodPosition.y
    foodElement.style.gridColumnStart = foodPosition.x
    foodElement.style.backgroundImage = "url('/image/apple.jpg')"
    foodElement.style.backgroundPosition = "center"
    foodElement.style.backgroundSize = "contain"
    foodElement.style.backgroundColor = "#dfdfdf"
    gameBoard.append(foodElement)
}

const eventKey = (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastLocal.y !== 0) {
                break
            }
            newLocal = {x: 0, y: -1}
            break;
        case 'ArrowDown':
            if (lastLocal.y !== 0) {
                break
            }
            newLocal = {x: 0, y: 1}
            break;
        case 'ArrowLeft':
            if (lastLocal.x !== 0) {
                break
            }
            newLocal = {x: -1, y: 0}
            break;
        case 'ArrowRight':
            if (lastLocal.x !== 0) {
                break
            }
            newLocal = {x: 1, y: 0}
            break;
    }
}

const eventKeyWithGift = (e) => {
    // lastLocal = newLocal
    switch (e.key) {
        case 'ArrowDown':
            if (lastLocal.y !== 0) {
                break
            }
            newLocal = {x: 0, y: -1}
            break;
        case 'ArrowUp':
            if (lastLocal.y !== 0) {
                break
            }
            newLocal = {x: 0, y: 1}
            break;
        case 'ArrowRight':
            if (lastLocal.x !== 0) {
                break
            }
            newLocal = {x: -1, y: 0}
            break;
        case 'ArrowLeft':
            if (lastLocal.x !== 0) {
                break
            }
            newLocal = {x: 1, y: 0}
            break;
    }
}

window.addEventListener('keydown', eventKey)

let numberRand

const checkEat = () => {
    if ((bodySnake[0].x === foodPosition.x) && (bodySnake[0].y === foodPosition.y)) {
        score++;
        foodPosition = randomSetUpPosition(wall, bodySnake, gift)
        bodySnake.push(foodPosition)
        if (score % 2 === 0) {
            gift = randomSetUpPosition(wall, bodySnake, foodPosition, rock)
            if (nextLevelCount > 2) {
                numberRand = randomInTheRangeNotRepeat(1, 3)
                if (nextLevelCount > 2 && nextLevelCount <= 4) {
                    switch (numberRand) {
                        case 1:
                            giftElement.style.backgroundImage = "url('/image/arrow.png')"
                            break;
                        case 2:
                            giftElement.style.backgroundImage = "url('/image/fast.png')"
                            break;
                        case 3:
                            giftElement.style.backgroundImage = "url('/image/slow.png')"
                            break;
                    }
                } else {
                    giftElement.style.backgroundImage = "url('/image/gift.png')"
                }
            }
        }

        if (checkGift) {
            checkGift = false
            clearInterval(interval)
            interval = setInterval(main, 250)
            window.removeEventListener('keydown', eventKeyWithGift)
            window.addEventListener('keydown', eventKey)
            giftString = "Nothing"
        }
    }

    if ((bodySnake[0].x === gift.x) && (bodySnake[0].y === gift.y)) {
        checkGift = true
        delete gift.x
        delete gift.y
    }

    if (checkGift) {
        switch (numberRand) {
            case 1:
                giftString = "Reverse"
                window.removeEventListener('keydown', eventKey)
                window.addEventListener('keydown', eventKeyWithGift)
                break;
            case 2:
                giftString = "High speed"
                clearInterval(interval)
                interval = setInterval(main, 100)
                break;
            case 3:
                giftString = "Low speed"
                clearInterval(interval)
                interval = setInterval(main, 1000)
                break;
        }
    }
}


const checkWinLevelEasy = () => {
    bodySnake.map((snake, index) => {
        if (index > 1) {
            if (bodySnake[0].x === snake.x && bodySnake[0].y === snake.y) {
                gameOver()
            }
        }
    })
}

function gameOver() {
    popUpGameOver.css("display", "flex")
    btnAccept.click(function () {
        clearInterval(interval)
        interval = setInterval(main, 250)
        window.removeEventListener('keydown', eventKeyWithGift)
        window.addEventListener('keydown', eventKey)
        popUpGameOver.css("display", "none")
        setNewGame()
    })
    btnDeny.click(function () {
        popupNewGame.css("display", "flex")
        popUpGameOver.css("display", "none")
    })
    score = 0
}

const checkWinLevel1 = () => {
    checkWinLevelEasy()
    wall.map(segment => {
        if (bodySnake[0].x === segment.x && bodySnake[0].y === segment.y) {
            gameOver()
        }
    })
    bodySnake.map(snake => {
        if (rock.x === snake.x && rock.y === snake.y) {
            gameOver()
        }
    })
}


function setUpWall(gameBoard) {
    wall.map(segment => {
        const wall = document.createElement('div')
        wall.style.gridRowStart = segment.y
        wall.style.gridColumnStart = segment.x
        wall.style.backgroundSize = "cover"
        wall.style.backgroundPosition = "center"
        wall.style.backgroundRepeat = "repeat"
        wall.style.backgroundImage = "url('/image/brick.jpg')"
        gameBoard.append(wall)
    })
}

const levelEasy = () => {
    checkNotWall()
    checkWinLevelEasy()
}

const level1 = () => {
    checkWinLevel1()
}

const setUp = (gameBoard) => {
    setUpWall(gameBoard)
    setUpSnake(gameBoard)
    setUpFood(gameBoard)
    setUpRock(gameBoard)
    setUpGift(gameBoard)
}

btnNewGame.click(function () {
    nextLevelCount = 2
    wall = []
    rock = {}
    gift = {}
    setNewGame()
    popupNewGame.css("display", "none")
    popUpGameOver.css("display", "none")
    window.removeEventListener('keydown', eventKeyWithGift)
    window.addEventListener('keydown', eventKey)
})
chooseLevel.click(function () {
    displayChooseLevel.css("display", "flex")
    popUpGameOver.css("display", "none")
})
goBack.click(function () {
    displayChooseLevel.css("display", "none")
    popupNewGame.css("display", "flex")
    popUpGameOver.css("display", "none")
})
level.click(function () {
    nextLevelCount = parseInt($(this).val())
    setUpNewGame()
    popUpGameOver.css("display", "none")
    popupNewGame.css("display", "none")
    nextLevel.css("display", "none")
    window.removeEventListener('keydown', eventKeyWithGift)
    window.addEventListener('keydown', eventKey)
})
goMenu.click(function () {
    popupNewGame.css("display", "flex")
    popUpGameOver.css("display", "none")
})


function main() {
    gameBoard.html('')

    if (nextLevelCount > 3) {
        rockMove()
    }

    if (score > parseInt(scoreHigh.text())) {
        scoreHigh.text(score)
        localStorage.setItem('highestScore', parseInt(scoreHigh.text()))
    }
    if (localStorage.getItem('highestScore') === null) {
        highestScoreNewGame.text('HIGHEST SCORE: ' + 0)
        scoreHigh.text(0)
    } else {
        highestScoreNewGame.text('HIGHEST SCORE: ' + localStorage.getItem('highestScore'))
        scoreHigh.text(localStorage.getItem('highestScore'))
    }
    levelLabel.text('Level: ' + (nextLevelCount - 1));
    scoreLabel.text('Score: ' + score);
    giftLabel.text('Gift: ' + giftString)
    newScore = score + 1
    level1()
    levelEasy()
    setUp(gameBoard)
    updateSnake()
    checkEat()
    if (score === newScore) {
        count = 0;
    }
    if (count === 0) {
        if (score === futureScore) {
            setUpNewGame()
        }
    }
}


