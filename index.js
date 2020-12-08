//this is the source for the most of the code,https://github.com/victordibia/handtrack.js/
//this link helped me https://www.w3schools.com/graphics/game_controllers.asp

//variables
const video = document.getElementById("myvideo");
video.width=window.innerWidth;
video.height=window.innerHeight;           ;
const handimg = document.getElementById("handimage");
let trackButton = document.getElementById("trackbutton");
const context = canvas.getContext("2d");
let updateNote = document.getElementById("updatenote").style.height = "100px";
let image=document.getElementById("img");
image.src=('red.png');


//start function
function startGame() {
    window.scrollTo(0,0);
    Pointer = new component(10, 10, "red", 150, 150);
    area.start();
}

var area = {//area for pointer
    canvas : document.getElementById("canvas"),
    start : function() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);}}

//component function to work with canvas
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y; 
    this.update = function() {
        ctx = area.context; 
        ctx.drawImage(image, 700, 400);
        ctx.font = "30px Arial";
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#6f2da8"}
       
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;}}

function updateGameArea() {//update the area with spped and new position
    area.clear();
    Pointer.newPos();
    Pointer.update();
    Pointer.speedX=0;
    Pointer.speedY=0;
    Pointer.zIndex=1;}

let imgindex = 1
let isVideo = false;
let modell = null;
const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.8,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {//start video function for detection
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "move your hand left or right"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"}});}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"}}

trackButton.addEventListener("click", function(){
    toggleVideo();});

 
async function runDetection (){//detection function
    modell.detect(video).then(predictions => {
        if (isVideo) {requestAnimationFrame(runDetection);
        if (predictions[0]) {
            let midvalx = predictions[0].bbox[0]; //x
            let midvaly = predictions[0].bbox[1];//y
            b=window.outerWidth-800;
            if (midvalx > b){//range of position ro swipe images
                i=1;
                if(k==1){
                    image.src='red.png';
                    k=0;}}
            
            if (midvalx < 300){
                k=1;
                if(i==1){
                    image.src='yellow.png';
                    i=0; }}
            
           Pointer.x=midvalx;//the pointer follows the hand x and y position
           Pointer.y=midvaly;
        }
        }
        }
                            );}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    modell = lmodel
    updateNote.innerText = "Loaded Model!"   
    trackButton.disabled = false});
