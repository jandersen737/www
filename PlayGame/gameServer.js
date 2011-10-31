var context;//holds the canvas

var frameX = 210;
var frameY = 320;

var xBall=(frameX/2); //initial ball coords
var yBall=(frameY/2); //initial ball coords
var dx=1.2; //ball motion in x
var dy=2.5; //ball motion in y
var ballRadius = 10;

var paddleSize = frameY/8; //height
var paddleWidth = 10;
var leftPad = (frameY/2) - paddleSize/2; //yBall position of paddles init in the middle
var rightPad = (frameY/2) - paddleSize/2;

var motionStep = frameY/10; //reaction distance to a motion command

var scoreLeft = 0;
var scoreRight = 0;

var WHAT_PADDLE_AM_I;

var pieterMode = 0;

//var media = new Media("pong2.wav");

function initClient(){
context= document.getElementById("gameCanvas").getContext("2d");
}

function movePaddle(e){
var evntObj = (document.all)?event.keyCode:e.keyCode;
// var unicode = evntObj.charCode;
var actualKey = String.fromCharCode(evntObj);
//alert(evntObj + "\n" + actualKey);

moveMyPaddle(actualKey);

if(actualKey == "P"){
pieterMode = (pieterMode + 1) % 2;
}
};

function movePaddle2(actualKey){
moveMyPaddle(actualKey);

if(actualKey == "P"){
pieterMode = (pieterMode + 1) % 2;
}
};

function moveMyPaddle(actualKey){
if(WHAT_PADDLE_AM_I == 0){
if(actualKey == "W"){ //check which key was pressed
if(leftPad > 0){ // do nothing if it would move paddle out of frame
leftPad = leftPad - motionStep;
}
}
if(actualKey == "S"){
if(leftPad < (frameY - paddleSize)){
leftPad = leftPad + motionStep;
}
}updatePaddle(leftPad);
}else{
if(actualKey == "W"){ //check which key was pressed
if(rightPad > 0){ // do nothing if it would move paddle out of frame
rightPad = rightPad - motionStep;
}
}
if(actualKey == "S"){
if(rightPad < (frameY - paddleSize)){
rightPad = rightPad + motionStep;
}
}updatePaddle(rightPad);
}
}

function draw(){
context.clearRect(0,0, frameX,frameY); //clear the frame

if(pieterMode == 1){
       img = new Image();
       img.src = "pieter.jpg";
       context.drawImage(img, 0, 0,(img.width)/2 + 10, (img.height)/2 + 25);
}
drawRect(0,leftPad,paddleWidth, paddleSize, "rgb(0,200,0)");//xpos, ypos, width, height
drawRect(frameX-paddleWidth,rightPad,paddleWidth,paddleSize, "rgb(255,0,0)");

drawBall(xBall, yBall);
}

function drawRect(a, b, c, d, col){
context.save();

context.beginPath();
context.fillStyle = col; //color to fill shape in with
context.rect(a,b,c,d); //draws rect with top left corner a,b
context.closePath();
context.fill();

context.restore();
}

function drawBall(a, b){
context.save();

ballPaddleLogic();

context.beginPath();
context.fillStyle = "rgb(200,0,0)"; //color to fill shape in with

context.arc(xBall,yBall,ballRadius,0,Math.PI*2,true);
context.closePath();
context.fill();

context.restore();
}

function drawScore(pos){
//pos determines which side to draw score on, based on orientation either side of roughly midpoint
context.fillStyle = "#00f";
context.font = "bold 50px sans-serif";
context.textBaseline = "top";


if(pos < 600){
var score;
score = String(scoreLeft);
context.fillText("Player 1: " + score, pos, 10);
}
if(pos > 600){
var score;
score = String(scoreRight);
context.fillText("Player 2: " + score, pos,10);
}

}

function ballPaddleLogic(){

//Ball bouncing logic

if( yBall<0 || yBall>frameY){
dy = -dy; //change yBall direction if you go off screen....
}

//Paddle Boundary Logic

//changed all these numbers to more reasonable shit also, these kinda stuff should also be fields but we can
//think about that later

if((xBall <= 10) && (xBall > 5) && (yBall > leftPad) && (yBall < (leftPad + paddleSize))){ //if it hits the left paddle
dx = -1.1*dx; //get faster after you hit it
}
if((xBall >= frameX - 10) && (xBall <= frameX - 5) && (yBall >= rightPad) && (yBall <= (rightPad + paddleSize))){ //if it hits the right paddle
dx = -1.1*dx;
}

//if ball goes out of frame reset in the middle and put to default speed and increment score...

if(xBall < -40){ //changed these numbers you had old ones so ball was going super far out of frame
xBall = frameX/2;
yBall = frameY/2;
dx = 1;
dy = 2;
scoreRight++;
sendScore();
}
if(xBall > 250){ //changed these numbers you had old ones so ball was going super far out of frame
xBall = frameX/2;
yBall = frameY/2;
dx = 1;
dy = 2;
scoreLeft++;
sendScore();
}

xBall+=dx;
yBall+=dy;
}

document.onkeydown = movePaddle; //call movePaddle whenever any key is pressed

/**
* The "document.addEventListener" contains reactions to information sent by the server.
*/
document.addEventListener("DOMContentLoaded", function() {
//The DOMContentLoaded event happens when the parsing of the current page
//is complete. This means that it only tries to connect when it"s done
//parsing.
socket = io.connect("10.150.1.204:3000");
/*socket.on("gameStart", function (data) {//expecting a full start of game state
leftPad = data.paddle1;
rightPad = data.paddle2;
draw();
});*/
socket.on("newScore", function(data){
alert(data);
});
socket.on("paddleNum", function(data){
WHAT_PADDLE_AM_I = data.paddleNum;
});
socket.on("updateGame", function(data){//expecting arrays for paddle1, paddle2, ballPos
leftPad = data.paddle[0];
rightPad= data.paddle[1];
draw();
//draw(data.ballPos[0], data.ballPos[1]);
});
clientType();
});

/**
* Alert the server of our player type.
*/
function clientType(){
//alert("Sending client type");
socket.emit("clientType", {type: "player"});
};

function updatePaddle(position){
//alert("update paddle");
socket.emit("updatePaddle", {pos: position});
};

function sendScore(){
socket.emit("score", {left: scoreLeft, right: scoreRight});
};

function playPongSound(){
pongSound.play();
};



function promptLogin(){
var name = prompt("Username please. (Use \"guest\" if you don't already have an account.");
var pass = prompt("Please enter your password. (If you are logging in as \"guest\" then please use \"pass\".)");
}
