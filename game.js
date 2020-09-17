var myGamePiece;
var myObstacles = [];
var myScore;
var speed = 3;
function startGame() {  
    myGamePiece = new component(25, 25, "red", 10, 120);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
}
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 350;
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas); 
        this.frameNo = 0; 
        this.interval = setInterval(updateGameArea, 12);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        var element = document.getElementById("demo");
        element.innerHTML = "Game Over<br>Congrats your score is :" + myGameArea.frameNo + 
        "<br>Reload the page to restart the game.";
    }
}
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
function component(width, height, color, x, y, type) {
    this.type = type;
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;  
    this.update = function(){
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } 
        else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.hitBottom(); 
        this.hitUp();  
        this.hitLeft();  
        this.hitRight();       
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
        }
    }
    this.hitUp = function() {
        if(this.y < 0) {
            this.y = 0; 
        }
    }
    this.hitLeft = function() {
        if(this.x < 0) {
            this.x = 0; 
        }
    }
    this.hitRight = function() {
        var Right = myGameArea.canvas.width - this.width;
        if (this.x > Right) {
            this.x = Right;
        }
    }
}
function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for(i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(Math.floor(240/speed))) {
        x = myGameArea.canvas.width;
        minHeight = 25;
        maxHeight = 250;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 60;
        maxGap = 125;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles.push(new component(10, height, "#000080", x, 0));
        myObstacles.push(new component(10, x - height - gap, "#000080", x, height + gap));
    }
    if((myGameArea.frameNo)%1000 == 0)
        speed=speed+1;
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -speed;
        myObstacles[i].update();
    }
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -1-speed; }
    if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 1+speed; }
    if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -1-speed; }
    if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 1+speed; }
    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();    
    myGamePiece.update();
}