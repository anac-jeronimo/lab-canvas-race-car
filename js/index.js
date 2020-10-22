const canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");

window.onload = () => {
  document.getElementById('start-button').onclick = () => {
    startGame();
  };

  function startGame() {
    let obstacles =  [];
    gameArea.clear();
    player.newPos();
    player.update();
    updateObstacles();
    checkGameOver();
    gameArea.score();
  }
};
this.context = this.canvas.getContext("2d");

const gameArea = {
  canvas: document.createElement('canvas'),
  frames: 0,
  start: function() {
      this.canvas.width = 500;
      this.canvas.height = 700;
      this.interval = setInterval(updateGameArea, 20);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  
  stop: function() {
      clearInterval(this.interval);
  }, 
  score: function() {
      const points = Math.floor(this.frames / 5);
      this.context.font = '15px serif';
      this.context.fillStyle = 'black';
      this.context.fillText(`Score: ${points}`, 80, 50);
  }
}



class Car {
  constructor() {
      const image = new Image();
      image.addEventListener('load', () => {
        this.image = image;
        this.draw();
    });
    image.src = "./images/car.png",
      
  
  update() {
      const ctx = gameArea.context;
      //ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  newPos() {
      this.x += this.speedX;
      //this.y += this.speedY;
  };
  left() {
      return this.x + this.width;
  };
  right() {
      return this.x + this.width;
  };

  
  crashWith(obstacle) {
      return !(this.bottom() < obstacle.top() || 
              this.top() > obstacle.bottom() || 
              this.right() < obstacle.left() ||
              this.left() > obstacle.right())
  }
}



const image = new Image();
image.src = "./images/road.png";

const backgroundImage = {
    image: image,      
    x: 0,
    y:0,
    speed: -1,
    move : function() {
        this.y += this.speed;
        this.y %= canvas.height;
    }, 
    draw: function() {
        ctx.drawImage(this.image, 0, this.y);
        ctx.drawImage(this.image, 0, this.y - canvas.height);
    }
}

function updateCanvas() {
    backgroundImage.move();
    ctx.clearRect(0, 0, canvas.height, canvas.width );
    backgroundImage.draw();

    requestAnimationFrame(updateCanvas);
}

updateCanvas();


document.addEventListener('keydown', e => {
    switch (e.keyCode) {
        case 37:
        player.speedX -= 1;
        break;
        case 39:
        player.speedX += 1
        break;
    }
});

document.addEventListener('keyup', () => {
    player.speedX = 0;
    player.speedY = 0;
});

function updateObstacles() {
    // Move the obstacles
    for(let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += 1;
        obstacles[i].update();
    }
    startGame.frames+=1;
    if (startGame.frames % 120 === 0) {
        //push two new obstacles to an obstacle array
        let minHeight = 20;
        let maxHeight = 200;
        let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        let minGap = 50;
        let maxGap = 200;
        let gap = Math.floor(Math.random() * (maxGap - minGap +1 ) + minGap);
        //Adding the top obstacle
        obstacles.push(
            new Component(10, 
                height, 
                'blue', 
                startGame.canvas.width, 
                0
        ));

        //Adding the bottom obstacle
        obstacles.push(
            new Component(10, 
              startGame.canvas.width + height - gap, 
                'green', startGame.canvas.height, 
                width + gap
        ));
    }
}

function checkGameOver() {
    const crashed = obstacles.some((obstacle)=> {
        return player.crashWith(obstacle);
    });
    if (crashed) {
      startGame.stop();
    }
}
startGame.start();
