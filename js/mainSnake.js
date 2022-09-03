
let getVariable = getComputedStyle(document.documentElement)
let sizeX = Number.parseInt(getVariable.getPropertyValue('--variable-sizeX')) // Get chiều ngang của màn hình game
let sizeY = Number.parseInt(getVariable.getPropertyValue('--variable-sizeY')) // Get chiều dọc của màn hình game


let bodySnake = [] // Phần rắn
let foodPosition = {} // Phần thức ăn
let wall = [] // Phần tường
let rock = {} // Phần "Ghost"
let gift = {} // Vị trí của các item
let boom = [] // Vị trí của boom

let newLocalRock = {x: 1, y: 0} // Hướng di chuyển của Ghost
let newLocal = {x: 0, y: 0} // Hướng di chuyển của
let lastLocal = {x: 1, y: 0} // Hướng rắn đang di chuyển
let score = 0; // Điểm số
let nextLevelCount = 1; // Level tiếp theo
const SWAP_LEVEL = 5 // Số điểm chuyển level
const gameBoard = $('.game-main') // Màn hình game chính
let scoreHigh = $('.score-high') // Label điểm cao nhất
let popUpGameOver = $('.popup-game-over') // Màn hình game over
let btnAccept = $('.accept') // Button YES khi game over
let btnDeny = $('.deny') // Button NO khi game over
let futureScore = 0;
let nextLevel = $('.swap-level') // Menu chuyển đổi level
let count = 0;
let newScore = 0;
let levelLabel = $('.level') // Label level
let scoreLabel = $('.score') // Label điểm
let btnNewGame = $('.btn-new-game') // Button new game ở màn hình menu
let popupNewGame = $('.popup-new-game') // Màn hình new game
let chooseLevel = $('.choose-level') // Button chọn level
let displayChooseLevel = $('.display-choose-level') // Màn hình chọn level
let goBack = $('.go-back') // Button go back
let level = $('.btn-level') // Các button level
let highestScore = $('.highest-score') // Label điểm cao nhất
let highestScoreNewGame = $('.highest-score-new-game')
let goMenu = $('.go-menu') // Button go menu
let giftLabel = $('.gift') // Label gift hiện tại
let giftString = "Nothing"
let checkGift;
let lastNumberRand = []
let imgBoom = "url('/image/boom.png')"
let numberRand // Random các item

let interval = setInterval(main, 250)

// Set up wall
const setUpArrWallLevel1 = () => {
    // Set up các bức tường xung quanh rìa màn hình game
    for (let i = 1; i <= sizeX; i++) {
        for (let j = 1; j <= sizeY; j++) {
            if ((i === 1 || i === sizeX) || (j === 1 || j === sizeY)) {
                wall.push({x: i, y: j})
            }
        }
    }
}

// Set up wall
const setUpArrWallLevel2 = () => {
    // Set up 4 bức tường vuông góc
    let sizeWallX = Math.round(sizeX / 5); // Giới hạn chiều ngang của bức tường
    let sizeWallY = Math.round(sizeY / 5); // Giới hạn chiều dọc của bức tường

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

// Set up wall
const setUpArrWallLevel3 = () => {
    // Set up các bức tường ngang nằm giữa màn hình chính
    for (let i = 1; i <= sizeX; i++) {
        for (let j = 1; j <= sizeY; j++) {
            // Hai thanh dài
            if ((((j === 7) || (j === sizeX - 6)) && (i >= 3) && (i <= sizeY - 2))) {
                wall.push({x: i, y: j})
            }
            // Hai thanh ngắn
            if ((((j === 10) || (j === sizeX - 9)) && (i >= 6) && (i <= sizeY - 5))) {
                wall.push({x: i, y: j})
            }
        }
    }
}

// Reset và hiển thị khi qua level mới
function nextLevelFunc() {
    lastNumberRand = []
    boom = []
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

// Set up tường tùy theo level
function setUpNewGame() {
    futureScore = score + SWAP_LEVEL;
    // Random vị trí của Ghost
    if (nextLevelCount >= 4) {
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

// Random tọa độ X trong khoảng từ 2 -> (sizeX - 1)
function generateRandomX(min = 2, max = sizeX - 1) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand += min;
    return rand;
}

// Random tọa độ Y trong khoảng từ 2 -> (sizeY - 1)
function generateRandomY(min = 2, max = sizeY - 1) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand += min;
    return rand;
}

// Random vị trí tránh các "element"
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

// Set up new game
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

// Random số sau không bị trùng số trước
function randomInTheRangeNotRepeat(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let rand = Math.floor(step2) + min;
    if (lastNumberRand.length === max) {
        // Nếu lastNumberRand đã có tất cả số từ min -> max thì reset lại thành rỗng
        lastNumberRand = []
    }
    if (lastNumberRand.includes(rand)){
        // Tránh số random trước
        randomInTheRange(min, max)
    } else {
        lastNumberRand.push(rand)
    }
    return rand;
}

// Random ngẫu nhiên trong khoảng, không tránh số random trước
function randomInTheRange(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let rand = Math.floor(step2) + min;
    return rand;
}

// Ghost di chuyển hướng ngẫu nhiên di va chạm rìa
function rockMove() {
    if (rock.x >= sizeX) {
        // Khi chạm rìa phải
        newLocalRock = {x: randomInTheRange(-1, -1), y: randomInTheRange(-1, 1)}
    }

    if (rock.x < 1) {
        // Khi chạm rìa trái
        newLocalRock = {x: randomInTheRange(1, 1), y: randomInTheRange(-1, 1)}
    }

    if (rock.y >= sizeY) {
        // Khi chạm rìa dưới
        newLocalRock = {x: randomInTheRange(-1, 1), y: randomInTheRange(-1, -1)}
    }

    if (rock.y < 1) {
        // Khi chạm rìa trên
        newLocalRock = {x: randomInTheRange(-1, 1), y: randomInTheRange(1, 1)}
    }
    // Đổi hướng
    rock.x += newLocalRock.x
    rock.y += newLocalRock.y
}

// Rắn di chuyển xuyên rìa
const checkNotWall = () => {
    if (bodySnake[0].x > sizeX) {
        // Khi rắn chạm vào rìa phải
        bodySnake[0].x = 1
    }
    if (bodySnake[0].x === 0) {
        // Khi rắn chạm vào rìa trái
        bodySnake[0].x = sizeX
    }
    if (bodySnake[0].y > sizeY) {
        // Khi rắn chạm vào rìa dưới
        bodySnake[0].y = 1
    }
    if (bodySnake[0].y === 0) {
        // Khi rắn chạm vào rìa trên
        bodySnake[0].y = sizeY
    }
}

// Set up Ghost
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

// Set up boom
const setUpBoom = (gameBoard, img) => {
    boom.map(segment => {
        const boomElement = document.createElement('div')
        boomElement.style.gridRowStart = segment.y
        boomElement.style.gridColumnStart = segment.x
        boomElement.style.backgroundImage = img
        boomElement.style.backgroundPosition = "center"
        boomElement.style.backgroundSize = "contain"
        boomElement.style.backgroundRepeat = "no-repeat"
        gameBoard.append(boomElement)
    })

}

const giftElement = document.createElement('div')

// Set up gift
const setUpGift = (gameBoard) => {
    giftElement.style.gridRowStart = gift.y
    giftElement.style.gridColumnStart = gift.x
    giftElement.style.backgroundPosition = "center"
    giftElement.style.backgroundSize = "contain"
    giftElement.style.backgroundRepeat = "no-repeat"
    gameBoard.append(giftElement)
}

// Set up snake
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

// Update lại rắn mỗi khi ăn mồi (dài ra)
const updateSnake = () => {
    lastLocal = newLocal
    for (let index = bodySnake.length - 2; index >= 0; index--) {
        bodySnake[index + 1] = {...bodySnake[index]}
    }
    // Thay đổi hướng di chuyển của rắn
    bodySnake[0].x += newLocal.x
    bodySnake[0].y += newLocal.y
}

// Set up thức ăn
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

// Xử lý nhấn phím (lúc bình thường)
const eventKey = (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (lastLocal.y !== 0) {
                // Nếu rắn đang di chuyển xuống thì không thể nhấn phím lên
                break
            }
            newLocal = {x: 0, y: -1}
            break;
        case 'ArrowDown':
            if (lastLocal.y !== 0) {
                // Nếu rắn di chuyển lên thì không thể nhấn phím xuống
                break
            }
            newLocal = {x: 0, y: 1}
            break;
        case 'ArrowLeft':
            if (lastLocal.x !== 0) {
                // Nếu rắn đang di chuyển qua phải thì không thể nhấn phím trái
                break
            }
            newLocal = {x: -1, y: 0}
            break;
        case 'ArrowRight':
            if (lastLocal.x !== 0) {
                // Nếu rắn đang di chuyển qua trái thì không thể nhấn phím phải
                break
            }
            newLocal = {x: 1, y: 0}
            break;
    }
}

// Xử lý nhấn phím lúc rắn ăn phải item "reverse"
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

// Thực hiện random vị trí của boom
function randomBoom() {
    let randomBoomPos = randomSetUpPosition(wall, bodySnake, foodPosition, gift)
    if (nextLevelCount === 7) {
        boom.push(randomBoomPos)
    }

    if (nextLevelCount === 8) {
        boom.push(randomBoomPos)
        setTimeout(() => {
            // Xử lý boom nổ
            for (let i = randomBoomPos.x - 1; i < randomBoomPos.x - 1 + 3; i++) {
                for (let j = randomBoomPos.y - 1; j < randomBoomPos.y - 1 + 3; j++) {
                    let temp = {x: i, y: j}
                    boom.push(temp)
                    imgBoom = "url('/image/boomed.png')"
                }
            }
        }, 5000)
        setTimeout(() => {
            // Reset sau khi boom nổ
            boom = []
            imgBoom = "url('/image/boom.png')"
        }, 5500)
    }
}

// Sau 10s sẽ xuất hiện boom
setInterval(randomBoom, 10000)


// Thực hiện kiểm tra rắn ăn (item, thức ăn)
const checkEat = () => {
    // Rắn ăn thức ăn
    if ((bodySnake[0].x === foodPosition.x) && (bodySnake[0].y === foodPosition.y)) {
        score++; // Điểm được cộng thêm 1
        foodPosition = randomSetUpPosition(wall, bodySnake, gift) // Random vị trí mới của thức ăn
        bodySnake.push(foodPosition) // Xử lý phần dài ra khi ăn thức ăn
        if (score % 2 === 0) {
            // Nếu điểm là giá trị chẵn thì xuất hiện item
            gift = randomSetUpPosition(wall, bodySnake, foodPosition, rock)
            if (nextLevelCount > 3) { // Level 3 trở đi mới có sự xuất hiện của item
                numberRand = randomInTheRangeNotRepeat(1, 3) // Random các item
                if (nextLevelCount > 3 && nextLevelCount <= 5) {
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
        // Sau khi rắn ăn item và tiếp tục ăn thức ăn thì reset lại như ban đầu (reset tốc độ, reset nhấn phím)
        if (checkGift) {
            checkGift = false
            clearInterval(interval)
            interval = setInterval(main, 250)
            window.removeEventListener('keydown', eventKeyWithGift)
            window.addEventListener('keydown', eventKey)
            giftString = "Nothing"
        }
    }
    // Rắn ăn item
    if ((bodySnake[0].x === gift.x) && (bodySnake[0].y === gift.y)) {
        checkGift = true
        delete gift.x
        delete gift.y
    }

    // Xử lý các sự kiện sau khi rắn ăn phải item
    if (checkGift) {
        switch (numberRand) {
            case 1: // Item "reverse"
                giftString = "Reverse"
                window.removeEventListener('keydown', eventKey)
                window.addEventListener('keydown', eventKeyWithGift)
                break;
            case 2: // Item "high speed"
                giftString = "High speed"
                clearInterval(interval)
                interval = setInterval(main, 100)
                break;
            case 3: // Item low speed
                giftString = "Low speed"
                clearInterval(interval)
                interval = setInterval(main, 1000)
                break;
        }
    }
}


const checkWinLevelEasy = () => {

}

function gameOver() {
    // Xử lý game over
    popUpGameOver.css("display", "flex")
    // Nhấn button YES
    btnAccept.click(function () {
        clearInterval(interval)
        interval = setInterval(main, 250)
        window.removeEventListener('keydown', eventKeyWithGift)
        window.addEventListener('keydown', eventKey)
        popUpGameOver.css("display", "none")
        setNewGame()
    })
    // Nhấn button NO
    btnDeny.click(function () {
        popupNewGame.css("display", "flex")
        popUpGameOver.css("display", "none")
    })
    score = 0
}

const checkGame = () => {
    // Rắn tự ăn bản thân -> Game over
    bodySnake.map((snake, index) => {
        if (index > 1) {
            if (bodySnake[0].x === snake.x && bodySnake[0].y === snake.y) {
                gameOver()
            }
        }
    })
    // Rắn đụng phải tường -> Game over
    wall.map(segment => {
        if (bodySnake[0].x === segment.x && bodySnake[0].y === segment.y) {
            gameOver()
        }
    })
    // Rắn đâm phải Ghost -> Game over
    bodySnake.map(snake => {
        if (rock.x === snake.x && rock.y === snake.y) {
            gameOver()
        }
    })
    // Rắn đâm phải boom -> Game over
    boom.map(segment => {
        if (bodySnake[0].x === segment.x && bodySnake[0].y === segment.y) {
            gameOver()
        }
    })
}

// Set up tường
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

// const levelEasy = () => {
//     checkNotWall()
//     checkWinLevelEasy()
// }
//
// const level1 = () => {
//     checkWinLevel1()
// }

// Set up game
const setUp = (gameBoard) => {
    setUpWall(gameBoard)
    setUpSnake(gameBoard)
    setUpFood(gameBoard)
    setUpRock(gameBoard)
    setUpGift(gameBoard)
    setUpBoom(gameBoard, imgBoom)
}

// Nhấm button new game
btnNewGame.click(function () {
    nextLevelCount = 2
    wall = []
    rock = {}
    gift = {}
    boom = []
    setNewGame()
    popupNewGame.css("display", "none")
    popUpGameOver.css("display", "none")
    window.removeEventListener('keydown', eventKeyWithGift)
    window.addEventListener('keydown', eventKey)
})

// Nhấn button choose level
chooseLevel.click(function () {
    displayChooseLevel.css("display", "flex")
    popUpGameOver.css("display", "none")
})

// Nhấn button go back
goBack.click(function () {
    displayChooseLevel.css("display", "none")
    popupNewGame.css("display", "flex")
    popUpGameOver.css("display", "none")
})

// Nhấn các button level
level.click(function () {
    wall = []
    rock = {}
    gift = {}
    boom = []
    nextLevelCount = parseInt($(this).val())
    setUpNewGame()
    popUpGameOver.css("display", "none")
    popupNewGame.css("display", "none")
    nextLevel.css("display", "none")
    window.removeEventListener('keydown', eventKeyWithGift)
    window.addEventListener('keydown', eventKey)
})

// Nhấn button go menu
goMenu.click(function () {
    popupNewGame.css("display", "flex")
    popUpGameOver.css("display", "none")
})

// Phương thức chính để chạy game
function main() {
    gameBoard.html('') // Reset lại màn hình chơi game
    if (nextLevelCount >= 4) {  // level 3 bắt đầu có Ghost di chuyển
        rockMove()
    }
    if (score > parseInt(scoreHigh.text())) {
        scoreHigh.text(score)
        localStorage.setItem('highestScore', parseInt(scoreHigh.text()))
    }
    // Lưu high score vào localStorage
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
    checkGame()
    checkNotWall()
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


