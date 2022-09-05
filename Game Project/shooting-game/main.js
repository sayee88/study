// 캔버스 세팅
let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameoverImage;
let gameOver = false; // true 이면 게임이 끝남, false 이면 게임이 안끝남.

// 점수판
let score = 0;

// 우주선 좌표
let spaceshipX = canvas.width/2 - 32;
let spaceshipY = canvas.height - 64;


let bulletList = [] // 총알들을 저장하는 리스트
function Bullet(){
    // 총알 생성하기 위한 재료를 모아둔 함수 
    // 하나하나 생성하기 힘드니까
    this.x = 0;
    this.y = 0;

    // 우주선 위치에서 총알이 나가야하기 때문에 
    this.init = function(){// 초기화하는 함수
        this.x = spaceshipX ;
        this.y = spaceshipY;
        this.alive = true; // true 면 살아있는 총알 false면 죽은 총알
        
        bulletList.push(this);
    }

    this.update = function(){
        this.y -= 7;
    };

    this.checkHit = function(){

        for(let i=0; i < enemyList.length; i++){
            if(this.y <= enemyList[i].y && 
                this.x >= enemyList[i].x && 
                this.x <= enemyList[i].x+40){
                score++;
                this.alive = false; // 죽은 총알
                enemyList.splice(i,1); // 죽은 적군 잘라내기 
            }

        }
    }
}


function generateRandomValue(min, max){// 최소값, 최대값 (canvas안에서)
    let randomNum = Math.floor(Math.random()*(max-min+1))+min // 최대값 최소값 사이에서 랜덤값 받는 법
    return randomNum;
}

let enemyList = [];
function Enemy(){
    this.x = 0;
    this.y = 0;
    this.init = function(){
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width-48);
        enemyList.push(this);
    }

    this.update = function(){
        this.y += 1; // 적군의 속도 조절

        if(this.y >= canvas.height - 48){
            gameOver = true;
        }
    }
}

function loadImage(){ // 이미지 다 불러오기
    backgroundImage = new Image();
    backgroundImage.src = "images/background.gif"; // 우주배경불러오기
 
    spaceshipImage = new Image();
    spaceshipImage.src = "images/spaceship.png"; // 우주선

    bulletImage = new Image();
    bulletImage.src = "images/bullet.png"; // 총알

    enemyImage = new Image();
    enemyImage.src = "images/enemy.png"; // 적

    gameoverImage = new Image();
    gameoverImage.src = "images/gameover.jpg"; 
}

let keysDown = {};

function setupkeyboardListener(){
    document.addEventListener("keydown", function(event){
        keysDown[event.keyCode] = true;
        console.log("키 다운 객체에 들어간 값은?", keysDown);
    });
    document.addEventListener("keyup", function(){
        delete keysDown[event.keyCode];

        // 총알이 하나씩 발사되게 하기 위해서 keyup에 작성
        if(event.keyCode == 32){ // spacebar는 숫자가 32
            createBullet(); // 총알이라는 함수를 만들겠다.
        } 

        console.log("버튼 클릭 후", keysDown);
    });
}

// createBullet() 따로 만드는 이유
// 하나의 함수에는 하나의 역할을 담고 있어야 함.
// 코드의 이해를 돕기 위해
function createBullet(){
    console.log("총알 생성");
    let b = new Bullet(); // 재료를 b에 저장
    b.init();
    console.log("새로운 총알 리스트", bulletList);
}

// 적군 만들기
function createEnemy(){
    const interval = setInterval(function(){
        let e = new Enemy();
        e.init();
    },1000) // ms 가 단위임 1s = 1000ms
}

function update(){
    if(39 in keysDown){
        spaceshipX += 5; // 우주선 속도
    } // right
    if(37 in keysDown){
        spaceshipX -= 5;
    } // left

    // 우주선의 좌표값이 경기장 안에만 있게 하려면?
    if(spaceshipX <= 0){
        spaceshipX = 0
    }
    if(spaceshipX >= canvas.width - 64){
        spaceshipX = canvas.width - 64;
    }
    // 우주선의 좌표값이 무한대로 업데이트가 되는게 아닌! 경기장 안에서만


    // 총알의 y좌표 업데이트하는 함수 호출
    for(let i=0; i<bulletList.length; i++){

        if(bulletList[i].alive){ // 살아있는 총알이라면
            bulletList[i].update();
            bulletList[i].checkHit();
        }
    }

    // 적군 y좌표 업데이트 하는 함수 호출
    for(let i=0; i<enemyList.length; i++){
        enemyList[i].update();
    }

}


// 이미지를 보여주기 위한
function render(){
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText('Score:${score}', 20, 20);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";

    // 총알그려주기
    for(let i=0; i < bulletList.length; i++){
        if(bulletList[i].alive){
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }
    }


    // 적군 그려주기
    for(let i=0; i < enemyList.length; i++){
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }

}

function main(){

    if(!gameOver){
        
        update(); // 좌표값을 업데이트 하고
        render(); /// 그려주고
        console.log("animation calls main function");
        requestAnimationFrame(main);
    } else {
        ctx.drawImage(gameoverImage, 10, 100, 380, 380);
    }
}

loadImage();
setupkeyboardListener();
createEnemy();
main();

// 방향키를 누르면
// 우주선의 xy 좌표가 바뀌고
// 다시 render 그려준다


// 총알 만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y값이 -- , 총알의 x 값은? 스페이스를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알들은 총알배열에 저장을 한다.
// 4. 모든 총알들은 x,y 좌표값이 있어야 한다.
// 5. 총알 o 배열을 가지고 render 그려준다. 


// 적군
// x,y,init,update
// 1. 위치가 랜덤하다.
// 2. 적은은 밑으로 내려온다. y좌표가 ++
// 3. 1초마다 하나씩 적군이 나온다. (재량)
// 4. 적군의 우주선이 바닥에 닿으면 게임 오버
// 5. 적군과 총알이 만나면 우주선이 사라진다. + 점수 1점 획득!

// 적군이 죽는다
// 총알.y <= 적군.y And
// 총알.x >= 적군.x and 총알.x <= 적군.x + 적군의 넓이
// 닿았다 -> 총알이 죽게됨. 적군의 우주선이 없어짐 -> 점수 획득