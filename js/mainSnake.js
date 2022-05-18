let getVariable = getComputedStyle(document.documentElement)

let sizeX = Number.parseInt(getVariable.getPropertyValue('--variable-sizeX'))
let sizeY = Number.parseInt(getVariable.getPropertyValue('--variable-sizeY'))


let bodySnake = [
    {
        x: 5,
        y: 2
    }
]

let foodPosition = {
    x: 10,
    y: 5
}

let wall = []


let newLocal = {x: 0, y: 0}
let lastLocal = {x: 1, y: 0}

window.addEventListener('keydown', e => {
    lastLocal = newLocal
    switch (e.key) {
        case 'ArrowUp':
            if (lastLocal.y !== 0)
                break
            newLocal = {x: 0, y: -1}
            break;
        case 'ArrowDown':
            if (lastLocal.y !== 0)
                break
            newLocal = {x: 0, y: 1}
            break;
        case 'ArrowLeft':
            if (lastLocal.x !== 0)
                break
            newLocal = {x: -1, y: 0}
            break;
        case 'ArrowRight':
            if (lastLocal.x !== 0)
                break
            newLocal = {x: 1, y: 0}
            break;
    }
})

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

const setUpSnake = (gameBoard) => {
    bodySnake.map((snake, count) => {
        const snakeElement = document.createElement('div')
        snakeElement.style.gridRowStart = snake.y
        snakeElement.style.gridColumnStart = snake.x
        if (count === 0)
            snakeElement.style.backgroundColor = 'green'
        else
            snakeElement.style.backgroundColor = '#3db500'
        gameBoard.append(snakeElement)
    })
}

const updateSnake = () => {
    for (let index = bodySnake.length - 2; index >= 0; index--) {
        bodySnake[index + 1] = {...bodySnake[index]}
    }
    bodySnake[0].x += newLocal.x
    bodySnake[0].y += newLocal.y
}

const generateRandom = () => {
    let randX = generateRandomX();
    let randY = generateRandomY();
    bodySnake.map(snake => {
        if ((randX === snake.x) && (randY === snake.y)) {
            randX = generateRandomX()
            randY = generateRandomY()
        }
    })

    wall.map(segment => {
        if ((randX === segment.x) && (randY === segment.y)) {
            randX = generateRandomX()
            randY = generateRandomY()
        }
    })
    const result = {
      x: randX,
      y: randY
    };
    return result;
}


const generateRandomX = (min = 2, max = sizeX - 1) => {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}

const generateRandomY = (min = 2, max = sizeY - 1) => {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand;
}

const setUpFood = (gameBoard) => {
    const foodElement = document.createElement('div')
    foodElement.style.gridRowStart = foodPosition.y
    foodElement.style.gridColumnStart = foodPosition.x
    foodElement.style.backgroundColor = 'red'
    gameBoard.append(foodElement)
}

const updateFood = () => {
    // let randomX = generateRandomX()
    // let randomY = generateRandomY()
    // bodySnake.map(snake => {
    //     if ((randomX === snake.x) && (randomY === snake.y)) {
    //         randomX = generateRandomX()
    //         randomY = generateRandomY()
    //     }
    // })
    //
    // wall.map(segment => {
    //     if ((randomX === segment.x) && (randomY === segment.y)) {
    //         randomX = generateRandomX()
    //         randomY = generateRandomY()
    //     }
    // })
    foodPosition.x = generateRandom().x
    foodPosition.y = generateRandom().y
}

let score = 0;


const checkEat = () => {
    if ((bodySnake[0].x === foodPosition.x) && (bodySnake[0].y === foodPosition.y)) {
        score++;
        bodySnake.push(foodPosition)
        updateFood()
    }
}

const checkWinLevelEasy = () => {
    bodySnake.map((snake, index) => {
        if (index > 1) {
            if (bodySnake[0].x === snake.x && bodySnake[0].y === snake.y) {
                alert('Fail')
            }
        }
    })
}

const checkWinLevel1 = () => {
    checkWinLevelEasy()
    wall.map(segment => {
        if (bodySnake[0].x === segment.x && bodySnake[0].y === segment.y) {
            alert('Fail Wall')
        }
    })

}

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

setUpArrWallLevel1()
setUpArrWallLevel2()

const setUpWall = (gameBoard) => {
    wall.map(segment => {
        const wall = document.createElement('div')
        wall.style.gridRowStart = segment.y
        wall.style.gridColumnStart = segment.x
        wall.style.backgroundColor = 'blue'
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
    setUpSnake(gameBoard)
    setUpFood(gameBoard)
}


const gameBoard = $('.game-main')

function main() {
    gameBoard.html('')
    level1()
    levelEasy()
    setUp(gameBoard)
    updateSnake()
    checkEat()
    setUpWall(gameBoard)
}

let interval = setInterval(main, 250)
