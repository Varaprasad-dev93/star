let board=document.querySelector('.board');
const start=document.querySelector('.start');
let hscore=document.querySelector('.hscore');
let Score=document.querySelector('.Score');
let boardHeight=640;
let boardWidth=420;
let context;
//score attributes
let score=0,highscore=0,Hscore;
try{
    highscore=localStorage.getItem(Hscore);
    hscore.innerHTML=highscore;
}
catch(e){
    localStorage.setItem(Hscore,0);
    highscore=0;
}
let audio=document.createElement('audio');
let audio1=document.createElement('audio');
//bird attributes
const birdImg=new Image();
birdImg.src='egg.png';
let bheight=54;
let bwidth=54;
let birdX=boardWidth/6;
let birdY=boardHeight/2;
let VelocityX=-2;//for pipes to move on x axis
let VelocityY=0;//for bird to speed the bird movement
let gravity=0.4;//To make the bird to fall
let pipes=[];//It contains of arrays of pipes
let gameOver=false;
let topPipeImg=new Image();
let bottomPipeImg=new Image();
topPipeImg.src='pipe.png';
bottomPipeImg.src='Tpipe.png';
let pipeHeight=340;
let pipeWidth=50;
let bird={
    img:birdImg,
    x:birdX,
    y:birdY,
    width:bwidth,
    height:bheight
}
window.onload=loaded;
function loaded(){
    board.height=boardHeight;
    board.width=boardWidth;
    context=board.getContext('2d');
    birdImg.onload=()=>{
        context.drawImage(bird.img,bird.x,bird.y,bird.width,bird.height);
    }
    start.addEventListener('click',move);
}
function move()
{
    console.log(gameOver);
    start.style.display='none';
    document.addEventListener('click',fly);
    document.addEventListener('keydown',(e)=>{
        if(e.key=' '){
            fly();
        }
    });
    update();
    setInterval(placePipe,1500);
}
function fly(){
    VelocityY=-6;
    audio.src='flapSound.mp3';
    audio.volume='0.5';
    audio.play();
}
function placePipe(){
    if(gameOver){
        restart();
        return;
    }
    let pHeight=0-(pipeHeight/4)-Math.random()*(pipeHeight/2);
    let Tpipe={
        img:topPipeImg,
        x:340,
        y:pHeight,
        height:pipeHeight,
        width:pipeWidth,
        passed:false
    }
    pipes.push(Tpipe);
    let Bpipe={
        img:bottomPipeImg,
        x:340,
        y:pipeHeight+pHeight+150,
        height:pipeHeight*2,
        width:pipeWidth,
        passed:false
    }
    pipes.push(Bpipe);
}
function update(){
    if(gameOver){
        restart();
        return;
    }
    if(bird.y>boardHeight){
        bird.y=birdY;
        gameOver=true;
    }
    requestAnimationFrame(update);
    context.clearRect(0,0,boardWidth,boardHeight); 
    VelocityY+=gravity//it keeps on increase by 0.4
    bird.y=Math.max(bird.y+VelocityY,0);
    context.drawImage(bird.img,bird.x,bird.y,bird.width,bird.height);
    for(let i=0;i<pipes.length;i++){
        let p=pipes[i];
        if(score>25 && score<50){
            VelocityX=-5;
            p.x+=VelocityX+1;
        }
        else if(score>50 && score<70){
            VelocityX=-7;
            p.x+=VelocityX+2;
        }
        else{
            VelocityX=-2;
            p.x+=VelocityX;
        }
        console.log(VelocityX);
        context.drawImage(p.img,p.x,p.y,p.width,p.height);
        if(!p.passed && bird.x>p.x+p.width){
            audio1.src='pipeSound.wav';
            audio1.play();
            score+=0.5;
            highscore=Math.max(score,highscore);
            localStorage.setItem(Hscore,highscore);
            hscore.innerHTML=highscore;
            Score.innerHTML=score;
            p.passed=true;
        }
        if(detectCollision(bird,p)){
            cancelAnimationFrame(update);
            audio1.src='fallSound.wav';
            audio1.play();
            gameOver=true;
        }
    }
}
function detectCollision(b,p){
    return (b.x<p.x+p.width  &&
    b.x+b.width-20 >p.x &&
    b.y+20<p.y+p.height &&
    b.y+b.height-20>p.y)
}
function restart() {
    if (gameOver) {
        // Show the start button with "Game Over" message
        start.innerHTML = "Game Over";
        start.style.display = "block";
        start.onclick = () => {
            location.reload(true);
        };
    }
}
