window.onload = () => {

    let BombDragNode = undefined;
    var GlobalExtended = [],
        GlobalTransitionValue = false;
    var WeightedSearch = false,
        DijkstraSearch = false,
        GreedyBestFirst =false,
        Swarm = false;

    let CleverPath = [];

    let mazed = false;

    const BREADTH = window.innerWidth,
        LENGTH = window.innerHeight;

    let header = document.getElementsByClassName("header");
    // header[0].style.gridTemplateRows = 50 + "px";
    let keybar = document.getElementsByClassName("keybar-content");
    // keybar[0].style.gridTemplateRows = 50 + "px";
    let infobar = document.getElementsByClassName("info-bar");
    // infobar[0].style.gridTemplateRows = 50 + "px";

    let addbomb = false;
    let bombBtn = document.getElementById("addbomb");
    var clearWallsBtn = document.getElementById("clearwall")
    var clearPath = document.getElementById("clearPath");
    let keybuttons = document.getElementsByClassName("btn");
    let speedbuttons = document.getElementsByClassName("speed");
    let dropdownBtns = document.getElementsByClassName("dropdown");
    let dropdownContent = document.getElementsByClassName("dropdown-content");

    let recurInvert = false;
    let recur = document.getElementsByClassName("recursive-backtracking");
    let recurInverse = document.getElementsByClassName("recursive-inverse");
    let recursiveDiv = document.getElementsByClassName("recursive-division");
    let recursiveVertical = document.getElementsByClassName("vertical-skew");
    let recursiveHorizontal = document.getElementsByClassName("horizontal-skew");
    let recursiveOptimal = document.getElementsByClassName("optimal-fix");
    let randomMaze = document.getElementsByClassName("random-maze");
    let StairMaze = document.getElementsByClassName("stair-maze");
    let DijkstraBtn = document.getElementsByClassName("Dijkstra");
    let SwarmBtn = document.getElementsByClassName("Swarm");
    let GreedySearchBtn = document.getElementsByClassName("Greedy-Best");
    let BidirectionalBtn = document.getElementsByClassName("Bidirectional");
    let AStar = document.getElementsByClassName("AStar");

    let SPEED = 0;

    for (let i = 0; i < speedbuttons.length; i++) {

        speedbuttons[i].onclick = () => {
            SPEED = parseInt(speedbuttons[i].getAttribute("id"));
            document.getElementsByClassName("spd")[0].textContent = speedbuttons[i].getAttribute("value");
        }
    }

    var bombImg = document.getElementById("source");
    var startImg = document.getElementById("sourceStart");
    var targetImg = document.getElementById("sourceTarget");
    var WeightImg = document.getElementById("sourceWeight");

    var canvas = document.getElementById("canvas");
    var targetCanvas = document.getElementById("target");
    var startCanvas = document.getElementById("start");
    var bombCanvas = document.getElementById("bomb");

    var ctx = canvas.getContext("2d"),
        targetCtx = targetCanvas.getContext("2d"),
        startCtx = startCanvas.getContext("2d"),
        bombCtx = bombCanvas.getContext("2d");
    var dim = 20;
    let half = dim * 0.5;
    var num = Math.floor(BREADTH / dim);

    let threes = num % 2;

    num = (threes == 0) ? (num + 1) : num;

    let col = Math.floor((LENGTH - 130) / dim);

    threes = col % 2;

    col = (threes == 0) ? (col + 1) : col;

    var BombNodes = [];
    var BombReferenceCoord = [];
    var ComponentNodes = [];

    const setTargetCanvas = () => {
        targetCanvas.width = BREADTH;
        targetCanvas.height = LENGTH - 130;
        targetCanvas.style.position = "absolute";
        // targetCanvas.style.backgroundColor = "#108";
        targetCanvas.style.top = 130 + "px";
        // targetCanvas.style.display = "none";
    }

    const setStartCanvas = () => {
        startCanvas.width = BREADTH;
        startCanvas.height = LENGTH - 130;
        startCanvas.style.position = "absolute";
        startCanvas.style.top = 130 + "px";
    }

    const setBombCanvas = () => {
        bombCanvas.width = BREADTH;
        bombCanvas.height = LENGTH - 130;
        // bombCanvas.style.backgroundColor = "#108";
        bombCanvas.style.position = "absolute";
        bombCanvas.style.top = 130 + "px";
    }

    const clearCanvas = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    const clearTargetCanvas = () => {
        targetCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    const clearStartCanvas = () => {
        startCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    const clearBombCanvas = () => {
        bombCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    setTargetCanvas();
    setStartCanvas();
    setBombCanvas();

    const getRandomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    class ComponentNode {
        constructor(i, j, x, y, size) {
            this.i = i;
            this.j = j;
            this.x = x;
            this.y = y;
            this.ratio = 7;
            this.size = size;
            this.blocked = false;
            this.isStart = false;
            this.isTarget = false;
            this.hasBomb = false;
            this.centerX = this.x + half;
            this.centerY = this.y + half;
            this.leftnode;
            this.topnode;
            this.rightnode;
            this.bottomnode;
            this.red = 110;
            this.green = 48;
            this.blue = 48;
            this.opacity = 1.0;
            this.showColor = "rgba(0,0,0,0.15)";
            this.wasBlocked = false;
            this.first = "rgb(34, 56, 192)";
            this.second = "rgb(65, 207, 148)";
            this.third = "rgba(138, 159, 252, 0.8)";
            this.tested = false;
            this.traced = false;
            this.bi = false;
            this.en = false;
        }

        show() {
            ctx.beginPath();
            ctx.strokeStyle = this.showColor;
            ctx.lineWidth = 0.5;
            ctx.strokeRect(this.x, this.y, this.size, this.size);
            ctx.closePath();
        }

        drawBlock() {
            ctx.closePath();
            ctx.fillStyle = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + this.opacity + ")";
            // ctx.fillRect((this.centerX - (5 + this.ratio)), (this.centerY - (5 + this.ratio)), (dim - (half) + (this.ratio * 2)), (dim - (half) + (this.ratio * 2)));
            ctx.fillRect(this.x + this.ratio, this.y + this.ratio, (dim - (2 * this.ratio)), (dim - (2 * this.ratio)));
            ctx.fill();
            ctx.closePath();
        }

        mark() {
            if (this.isStart) {
              startfactor = 10;
              animateStartnode();
            } else if (this.isTarget) {
              keyvalue = -10;
              invokeCall();
            }
            this.ratio = Math.floor(dim*0.25);
            ctx.beginPath();
            ctx.fillStyle = "rgb(251, 255, 20)";
            ctx.moveTo(this.x + this.ratio, this.y + dim * 0.5);
            ctx.arcTo(
              this.x + this.ratio,
              this.y + this.ratio,
              this.x + dim * 0.5,
              this.y + this.ratio,
              this.ratio
            );
            ctx.arcTo(
              this.x + dim - this.ratio,
              this.y + this.ratio,
              this.x + dim - this.ratio,
              this.y + dim * 0.5,
              this.ratio
            );
            ctx.arcTo(
              this.x + dim - this.ratio,
              this.y + dim - this.ratio,
              this.x + dim * 0.5,
              this.y + dim - this.ratio,
              this.ratio
            );
            ctx.arcTo(
              this.x + this.ratio,
              this.y + dim - this.ratio,
              this.x + this.ratio,
              this.y + dim * 0.5,
              this.ratio
            );
            ctx.lineTo(this.x + this.ratio, this.y + dim * 0.5 + this.ratio);
            ctx.fill();
            ctx.closePath();
        }

        Trace(change=false) {
            if (this.isStart) {
              startfactor = 10;
              animateStartnode();
            } else if (this.isTarget) {
              keyvalue = -10;
              invokeCall();
            }

            this.wasBlocked = true;
            this.traced = true;

            if(change){
                this.ratio = 0;
                ctx.beginPath();
                ctx.fillStyle = "rgb(252, 255, 70)";
                ctx.fillRect(
                  this.x + this.ratio,
                  this.y + this.ratio,
                  dim - 2 * this.ratio,
                  dim - 2 * this.ratio
                );

                ctx.closePath();
                return;
            }

            this.ratio = Math.floor(dim*0.3);

            const animate = setInterval(() => {
              ctx.clearRect(
                this.x + this.ratio,
                this.y + this.ratio,
                dim - 2 * this.ratio,
                dim - 2 * this.ratio
              );

              ctx.beginPath();
              ctx.fillStyle = "rgb(251, 255, 20)";
              ctx.moveTo(this.x + this.ratio, this.y + dim * 0.5);
              ctx.arcTo(
                this.x + this.ratio,
                this.y + this.ratio,
                this.x + dim * 0.5,
                this.y + this.ratio,
                this.ratio
              );
              ctx.arcTo(
                this.x + dim - this.ratio,
                this.y + this.ratio,
                this.x + dim - this.ratio,
                this.y + dim * 0.5,
                this.ratio
              );
              ctx.arcTo(
                this.x + dim - this.ratio,
                this.y + dim - this.ratio,
                this.x + dim * 0.5,
                this.y + dim - this.ratio,
                this.ratio
              );
              ctx.arcTo(
                this.x + this.ratio,
                this.y + dim - this.ratio,
                this.x + this.ratio,
                this.y + dim * 0.5,
                this.ratio
              );
              ctx.lineTo(this.x + this.ratio, this.y + dim * 0.5 + this.ratio);
              ctx.closePath();
              ctx.fill();

              this.ratio--;
              if (this.ratio > -1) {
              } else {
                clearInterval(animate);
              }
            }, 80);
        }

        clear() {
            ctx.clearRect(this.x, this.y, this.size, this.size);
            this.show();
        }

        testblock(change = false) {
            if (this.isStart) {
              animateStartnode();
            } else if (this.isTarget) {
              invokeCall();
            }

            this.blocked = true;
            this.tested = true;
            this.wasBlocked = true;

            this.ratio = Math.floor(dim*0.27);

            const animate = setInterval(() => {

                ctx.beginPath();

                ctx.clearRect(
                  this.x + this.ratio,
                  this.y + this.ratio,
                  dim - 2 * this.ratio,
                  dim - 2 * this.ratio
                );

                ctx.fillStyle = this.third;

                if(this.ratio >= 2 && this.ratio <= 3){
                    ctx.fillStyle = this.second;
                }else if(this.ratio < 2){
                    ctx.fillStyle = this.third;
                }else{
                    ctx.fillStyle = this.first;
                }

                ctx.moveTo(
                  this.x + this.ratio,
                  this.y + dim * 0.5
                );
                ctx.arcTo(
                  this.x + this.ratio,
                  this.y + this.ratio,
                  this.x + dim * 0.5,
                  this.y + this.ratio,
                  this.ratio
                );
                ctx.arcTo(
                  this.x + dim - this.ratio,
                  this.y + this.ratio,
                  this.x + dim - this.ratio,
                  this.y + dim * 0.5,
                  this.ratio
                );
                ctx.arcTo(
                  this.x + dim - this.ratio,
                  this.y + dim - this.ratio,
                  this.x + dim * 0.5,
                  this.y + dim - this.ratio,
                  this.ratio
                );
                ctx.arcTo(
                  this.x + this.ratio,
                  this.y + dim - this.ratio,
                  this.x + this.ratio,
                  this.y + dim * 0.5,
                  this.ratio
                );
                ctx.lineTo(
                  this.x + this.ratio,
                  this.y + dim * 0.5 + this.ratio
                );
                ctx.closePath();
                ctx.fill();
                
                this.ratio -= 0.5;
                if (this.ratio > 0) {
                } else {
                  clearInterval(animate);
                }
                
            }, 80);
        }

        buildBlock() {

            const animateWallNode = setInterval(() => {

                if(this.ratio > 0){
                    ctx.clearRect(
                        this.x + this.ratio,
                        this.y + this.ratio,
                        dim - 2 * this.ratio,
                        dim - 2 * this.ratio
                    );

                    this.ratio--;
                    this.drawBlock();

                    ctx.fillStyle = "rgb(110, 48, 48)";

                    ctx.fillRect(
                      this.x + this.ratio,
                      this.y + this.ratio,
                      dim - 2 * this.ratio,
                      dim - 2 * this.ratio
                    );
                    ctx.fill();

                }else{
                    clearInterval(animateWallNode);
                }
                
            }, 50);
        }

        block() {
            if (!this.isStart && !this.isTarget && !this.hasBomb) {
                if(!this.blocked){
                    this.blocked = true;
                    this.wasBlocked = true;
                    this.buildBlock();
                }else{
                    if(this.tested || this.traced){
                        this.wasBlocked = true;
                        this.traced = false;
                        this.tested = false;
                        this.clear();
                        this.ratio = 7;
                        this.buildBlock();
                    }
                }
            }
        }

        getEdgeNeighbours() {
            let neighbours = [];

            let leftneighbour = getNode((this.i - 1), this.j);
            if (leftneighbour !== undefined) {
                if (!leftneighbour.blocked) {
                    neighbours.push(leftneighbour);
                }
            }

            let topneighbour = getNode((this.i), (this.j - 1));
            if (topneighbour !== undefined) {
                if (!topneighbour.blocked) {
                    neighbours.push(topneighbour);
                }
            }

            let rightneighbour = getNode((this.i + 1), (this.j));
            if (rightneighbour !== undefined) {
                if (!rightneighbour.blocked) {
                    neighbours.push(rightneighbour);
                }
            }

            let bottomneighbour = getNode((this.i), (this.j + 1));
            if (bottomneighbour !== undefined) {
                if (!bottomneighbour.blocked) {
                    neighbours.push(bottomneighbour);
                }
            }

            return neighbours;
        }

        getNeighbours() {
            let neighbours = [];

            let leftnodeX = this.centerX - (dim * 2);
            let leftnodeY = this.centerY;

            let topnodeX = this.centerX;
            let topnodeY = this.centerY - (dim * 2);

            let rightnodeX = this.centerX + (dim * 2);
            let rightnodeY = this.centerY;

            let bottomnodeX = this.centerX;
            let bottomnodeY = this.centerY + (dim * 2);

            for (let x = 0; x < ComponentNodes.length; x++) {

                let node = ComponentNodes[x];
                if (node.centerX == leftnodeX && node.centerY == leftnodeY) {
                    if (!node.blocked) {
                        neighbours.push(node);
                        this.leftnode = node;
                    }
                    break;
                }

            }

            for (let x = 0; x < ComponentNodes.length; x++) {

                let node = ComponentNodes[x];
                if (node.centerX == topnodeX && node.centerY == topnodeY) {
                    if (!node.blocked) {
                        neighbours.push(node);
                        this.topnode = node;
                    }
                    break;
                }
            }

            for (let x = 0; x < ComponentNodes.length; x++) {

                let node = ComponentNodes[x];
                if (node.centerX == rightnodeX && node.centerY == rightnodeY) {
                    if (!node.blocked) {
                        neighbours.push(node);
                        this.rightnode = node;
                    }
                    break;
                }
            }

            for (let x = 0; x < ComponentNodes.length; x++) {

                let node = ComponentNodes[x];
                if (node.centerX == bottomnodeX && node.centerY == bottomnodeY) {
                    if (!node.blocked) {
                        neighbours.push(node);
                        this.bottomnode = node;
                    }

                    break;
                }

            }

            return neighbours;
        }

        getChildNodes(type=false) {
            let neighbours = [];

            let leftnodeX = this.centerX - (dim);
            let leftnodeY = this.centerY;

            let topnodeX = this.centerX;
            let topnodeY = this.centerY - (dim);

            let rightnodeX = this.centerX + (dim);
            let rightnodeY = this.centerY;

            let bottomnodeX = this.centerX;
            let bottomnodeY = this.centerY + (dim);

            for (let x = 0; x < ComponentNodes.length; x++) {
              let node = ComponentNodes[x];
              if (node.centerX == rightnodeX && node.centerY == rightnodeY) {
                if(type){
                  if(node.blocked && node.tested){
                     neighbours.push(node);
                     this.rightnode = node;
                  }
                  if (!node.blocked) {
                    neighbours.push(node);
                    this.rightnode = node;
                  }
                }
                else if (!node.blocked) {
                  neighbours.push(node);
                  this.rightnode = node;
                }
                break;
              }
            }

            for (let x = 0; x < ComponentNodes.length; x++) {
              let node = ComponentNodes[x];
              if (node.centerX == topnodeX && node.centerY == topnodeY) {
                if (type) {
                  neighbours.push(node);
                  this.topnode = node;
                } else if (!node.blocked) {
                  neighbours.push(node);
                  this.topnode = node;
                }
                break;
              }
            }

            for (let x = 0; x < ComponentNodes.length; x++) {

                let node = ComponentNodes[x];
                if (node.centerX == leftnodeX && node.centerY == leftnodeY) {
                  if (type) {
                    neighbours.push(node);
                    this.leftnode = node;
                  } else if (!node.blocked) {
                    neighbours.push(node);
                    this.leftnode = node;
                  }
                    break;
                }

            }

            for (let x = 0; x < ComponentNodes.length; x++) {

                let node = ComponentNodes[x];
                if (node.centerX == bottomnodeX && node.centerY == bottomnodeY) {
                  if (type) {
                    neighbours.push(node);
                    this.bottomnode = node;
                  } else if (!node.blocked) {
                    neighbours.push(node);
                    this.bottomnode = node;
                  }

                    break;
                }

            }

            return neighbours;
        }
    }

    let keyvalue = -7;
    let targetCenterX = (dim * Math.floor(num * 0.8));
    let targetcenterY = dim * Math.floor(col * 0.5);

    let startfactor = 5;
    let StartCenterX = dim * (Math.floor(num * 0.2));
    let StartcenterY = dim * (Math.floor(col * 0.5));

    let BombCenterX = dim * Math.floor(num * 0.5);
    let BombCenterY = dim * Math.floor(col * 0.5);

    let ratio = 5;

    for (let j = 0; j < col; j++) {

        for (let i = 0; i < num; i++) {
            let index = (num * j) + i;
            ComponentNodes[index] = new ComponentNode(i, j, (i * dim), (j * dim), dim);
        }

    }

    const SetCanvasArea = () => {
        canvas.width = BREADTH;
        canvas.height = LENGTH - 130;
        // canvas.style.backgroundColor = "#ffb";
        canvas.style.position = "absolute";
        canvas.style.top = 130 + "px";

        for (let i = 0; i < ComponentNodes.length; i++) {
            ComponentNodes[i].show();
        }
    }

    SetCanvasArea();

    const UpdateCanvasArea = () => {
        clearCanvas();

        SetCanvasArea();

        for (let i = 0; i < ComponentNodes.length; i++) {
            let node = ComponentNodes[i];

            if (node.blocked) {
                node.drawBlock();
            }
        }
    }

    const UpdateCanvasExtendedQueue = () => {

        clearCanvas();
        SetCanvasArea();

        for (let i = 0; i < GlobalExtended.length; i++) {
            let node = GlobalExtended[i];

            node.drawBlock();
        }
    }

    const resetSearch = () => {
        WeightedSearch = false;
        DijkstraSearch = false;
        GreedyBestFirst = false;
        for (let i = 0; i < ComponentNodes.length; i++) {
            let node = ComponentNodes[i];
            if(node.tested || node.traced){
                node.bi = false;
                node.en = false;
                node.ratio = 7;
                node.clear();
                node.tested = false;
                node.traced = false;
                node.blocked = false;
                node.wasBlocked = false;
                node.first = "rgb(34, 56, 192)";
                node.second = "rgb(65, 207, 148)";
                node.third = "rgba(138, 159, 252, 0.8)";
                // node.show();
            }else if(!node.blocked){
                node.clear();
            }
        }
    }

    clearPath.addEventListener("click", ()=>{
        resetSearch();
    });

    const clearWallsAndWeights = () => {
        mazed = false;
        WeightedSearch = false;
        DijkstraSearch = false;
        GreedyBestFirst = false;
        resetSearch();
        clearCanvas();

        for (let i = 0; i < ComponentNodes.length; i++) {
            let node = ComponentNodes[i];
            node.ratio = 7;
            if (node.blocked) {
                node.clear();
                node.blocked = false;
                
            }else if(node.hasBomb){
                node.hasBomb = false;
            }

            if(node.tested) node.tested = false;
            if(node.traced) node.traced = false;
            if(node.wasBlocked) node.wasBlocked = false;

            node.first = "rgb(34, 56, 192)";
            node.second = "rgb(65, 207, 148)";
            node.third = "rgba(138, 159, 252, 0.8)";
        }

        SetCanvasArea();

        clearBombCanvas();

        if(addbomb){
            bombBtn.click();
        }

        BombNodes = [];
    }

    clearWallsBtn.onclick = function() {
        clearWallsAndWeights();
    }

    function animateWall() {
        const animateWallNode = setInterval(() => {
            if (ratio <= 5) {
                UpdateCanvasArea();
                ratio++;
            } else {
                ratio = 0;
                clearInterval(animateWallNode);
                return;
            }
        }, 20);

        return;
    }

    class BombNode {
        constructor(x, y) {
            this.i = null;
            this.j = null;
            this.x = x;
            this.y = y;
            this.ratio = 14;
        }

        animateBomb() {

            const animateBombNode = setInterval(() => {
                if (this.ratio > 3) {
                    this.ratio--;
                    clearBombCanvas();
                    this.show();
                } else {
                    this.show();
                    clearInterval(animateBombNode);
                }
            }, 40);

            return this;
        }

        show() {
            bombCtx.drawImage(bombImg, this.x - this.ratio, this.y - this.ratio, dim + this.ratio, dim + this.ratio);
            return this;
        }
    }

    bombBtn.addEventListener("click", (event) => {

      addbomb = !addbomb;

      if(addbomb) {
          bombBtn.textContent = "Remove Bomb";
          BombDragNode = new BombNode(BombCenterX, BombCenterY).show().animateBomb();
          UpdateBombCanvas();
      }
      else {
          clearBombCanvas();
          bombBtn.textContent = "Add bomb";
      }

    });

    const drawStartnode = () => {
        startCtx.drawImage(
          startImg,
          StartCenterX - startfactor,
          StartcenterY - startfactor,
          dim + (2*startfactor),
          dim + (2*startfactor)
        );

    }

    function animateStartnode() {
        startfactor = -10;
        // alert("nimationg start node");
        const animateNode = setInterval(() => {
            if (startfactor != -1) {
                clearStartCanvas();
                if(startfactor < 0) startfactor++;
                else startfactor--;
                drawStartnode();
            } else {
                // startfactor = 0;
                clearInterval(animateNode);
                return;
            }
        }, 70);

        return;
    }

    animateStartnode();

    const drawTargetnode = () => {

        targetCtx.drawImage(
          targetImg,
          targetCenterX - keyvalue,
          targetcenterY - keyvalue,
          dim + 2 * keyvalue,
          dim + 2 * keyvalue
        );

    }

    const UpdateStartCanvas = () => {
        clearStartCanvas();
        drawStartnode();
        animateStartnode();

        for (let x = 0; x < ComponentNodes.length; x++) {
            let node = ComponentNodes[x];
            if (node.x == StartCenterX && node.y == StartcenterY) {
                if (node.blocked) {
                    node.blocked = false;
                    node.wasBlocked = true;
                    node.clear();
                }
                node.isStart = true;
            } else {
                if (node.isStart) {
                  if (node.wasBlocked) {
                    node.ratio = 7;
                    node.blocked = true;

                    node.clear();

                    if(node.traced) node.Trace();
                    else if (node.tested) node.testblock();
                    else node.buildBlock();
                    // break;
                  }
                }
                node.isStart = false;
            }
        }
    }

    Array.prototype.merge = function(vector){
        
        for(let i = 0; i < vector.length; i++){
            if(!vector[i].tested){
                this.push(vector[i]);
            }
        }
    }

    const isEqual = (Node, Target) => {
        if(Node.i == Target.i && Node.j == Target.j){
            return true;
        }
        return false;
    }

    UpdateStartCanvas();

    function invokeCall() {
        keyvalue = -10;
        const animateTargetNode = setInterval(() => {
            if (keyvalue < -1) {
                clearTargetCanvas();
                drawTargetnode();
                keyvalue += 1;
            } else {
                clearInterval(animateTargetNode);
                return;
            }
        }, 70);

        return;
    }

    const UpdateTargetCanvas = () => {
        clearTargetCanvas();
        drawTargetnode();
        invokeCall();

        for (let x = 0; x < ComponentNodes.length; x++) {
            let node = ComponentNodes[x];
            if (node.x == targetCenterX && node.y == targetcenterY) {
                if (node.blocked) {
                    node.blocked = false;
                    node.wasBlocked = true;
                    node.clear();
                }
                node.isTarget = true;
            } else {
                if (node.isTarget) {

                  if (node.wasBlocked) {
                    node.ratio = 7;
                    node.blocked = true;
                    node.clear();

                    if (node.traced) node.Trace();
                    else if (node.tested) node.testblock();
                    else node.buildBlock();

                    node.isTarget = false;
                    // break;
                  }

                }

                node.isTarget = false;
            }
        }
    }

    UpdateTargetCanvas();

    const UpdateBombCanvas = () => {
        // clearBombCanvas();

        for (let x = 0; x < ComponentNodes.length; x++) {
          let node = ComponentNodes[x];

          if (node.x == BombCenterX && node.y == BombCenterY) {

            if (node.blocked) {
              node.blocked = false;
              node.wasBlocked = true;
              node.clear();
            }
            node.hasBomb = true;

            BombDragNode.i = node.i;
            BombDragNode.j = node.j;

          } else {

            if(node.hasBomb){
                if(node.wasBlocked){
                    node.ratio = 7;
                    node.blocked = true;
                    node.clear();

                    if (node.traced) node.Trace();
                    else if (node.tested) node.testblock();
                    else node.buildBlock();

                    node.hasBomb = false;
                    break;
                }
            }

            node.hasBomb = false;
          }
        }
    }

    invokeCall();

    var isDraggingTarget = false;
    var isDraggingStart = false;
    var isBuildingBlock = false;
    let Equal = false;
    let isDraggingBomb = false;

    startCanvas.addEventListener("click", (event) => {
        if (!mazed) {

            event.preventDefault();
            event.stopPropagation();

            let mouseX = event.offsetX;
            let mouseY = event.offsetY;

            let i = 1;
            let j = 1;

            while (true) {
                if ((dim * i) > mouseX) {
                    break;
                } else {
                    i++;
                }
            }

            let xcoord = (dim * i) - (dim * 0.5);

            while (true) {
                if ((dim * j) > mouseY) {
                    break;
                } else {
                    j++;
                }
            }

            let ycoord = (dim * j) - (dim * 0.5);
            xcoord -= dim * 0.5;
            ycoord -= dim * 0.5;

            if(true){

                for (let y = 0; y < ComponentNodes.length; y++) {
                  let node = ComponentNodes[y];
                  if (node.x == xcoord && node.y == ycoord) {
                    if (!node.blocked) node.block();
                  }
                }
            }
        }
    });

    startCanvas.addEventListener("mousedown", (event) => {

        event.preventDefault();
        event.stopPropagation();

        let mouseX = event.offsetX;
        let mouseY = event.offsetY;

        if (mouseX >= (StartCenterX) && mouseX <= (StartCenterX + dim)) {
            if (mouseY >= (StartcenterY) && mouseY <= (StartcenterY + dim)) {
                isDraggingStart = true;
            }
        }

        if (mouseX >= (targetCenterX) && mouseX <= (targetCenterX + dim)) {
            if (mouseY >= (targetcenterY) && mouseY <= (targetcenterY + dim)) {
                // alert("true");
                isDraggingTarget = true;
                invokeCall();
            }
        }

        if(addbomb && mouseX >= BombCenterX && mouseX <= (BombCenterX + dim)){
            if (mouseY >= BombCenterY && mouseY <= (BombCenterY + dim)) {
                isDraggingBomb = true;
                // alert("draggingbomb");
            }
        }

        if (!isDraggingStart && !isDraggingTarget && !isDraggingBomb) {
            if(mazed == false) isBuildingBlock = true;
        }
    });

    startCanvas.addEventListener("mouseup", (event) => {
        
        if (!isDraggingStart && !isDraggingTarget && !isDraggingBomb && !isBuildingBlock) {
            isBuildingBlock = false;
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (isDraggingStart) {
            animateStartnode();
        }
        else if (isDraggingBomb) {

          isDraggingBomb = false;

          BombDragNode = new BombNode(BombCenterX, BombCenterY, dim, dim).show().animateBomb();

          UpdateBombCanvas();

        } else{
          keyvalue = -7;
          invokeCall();
        } 

        CleverPath = [];
        if (WeightedSearch) {
          resetSearch();
          AstarSearchAlgorithm(addbomb, false, false);
        }else if(DijkstraSearch){
            resetSearch();
            Dijkstra(addbomb);
        }else if(GreedyBestFirst){
            resetSearch();
            GreedyBestSearch(addbomb);
        }else if(Swarm){
           resetSearch();
           ConvergentSwarm(addbomb);
        }

        isDraggingStart = false;
        isDraggingTarget = false;
        isBuildingBlock = false;
        isDraggingBomb = false;
        Equal = false;
    });

    startCanvas.addEventListener("mouseout", (event) => {
        if (!isDraggingStart && !isDraggingTarget && !isDraggingBomb) {
            isBuildingBlock = false;
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (isDraggingStart) animateStartnode();
        else if (isDraggingBomb) {
          isDraggingBomb = false;

          BombDragNode = new BombNode(BombCenterX, BombCenterY, dim, dim)
            .show()
            .animateBomb();

          UpdateBombCanvas();
        } else invokeCall();

        isDraggingStart = false;
        isDraggingTarget = false;
        isBuildingBlock = false;
        isDraggingBomb = false;
        Equal = false;
    });

    startCanvas.addEventListener("mousemove", (event) => {

        event.preventDefault();
        event.stopPropagation();

        let i = 1;
        let j = 1;

        let mouseX = event.offsetX;
        let mouseY = event.offsetY;

        while (true) {
            if ((dim * i) > mouseX) {
                break;
            } else {
                i++;
            }
        }

        while (true) {
            if ((dim * j) > mouseY) {
                break;
            } else {
                j++;
            }
        }

        let xcoord = (dim * i) - (dim * 0.5);
        let ycoord = (dim * j) - (dim * 0.5);

        if (isDraggingBomb === true) {
          BombCenterX = (dim * i) - dim;
          BombCenterY = (dim * j) - dim;

          clearBombCanvas();
          UpdateBombCanvas();

          BombDragNode = new BombNode(BombCenterX, BombCenterY).show();
        }

        if (!isDraggingStart && !isDraggingTarget) {
            if (isBuildingBlock) {

                xcoord -= (dim * 0.5);
                ycoord -= (dim * 0.5);

                for (let y = 0; y < ComponentNodes.length; y++) {
                    let node = ComponentNodes[y];
                    if (node.x == xcoord && node.y == ycoord) {
                        node.block();
                    }
                }
            }

            return;
        }

        keyvalue = -7;
        startfactor = -7;

        const factor = () => {

            if (isDraggingStart) {
                StartCenterX = (dim * i) - dim;
                StartcenterY = (dim * j) - dim;

                UpdateStartCanvas();
            } else {

                targetCenterX = (dim * i) - dim;
                targetcenterY = (dim * j) - dim;

                // invokeCall();

                UpdateTargetCanvas();
            }
        }

        factor();

    });

    const checkConflict = () => {

        function check() {

            if (StartCenterX == targetCenterX && StartcenterY == targetcenterY) {
                targetCenterX += dim;
                UpdateTargetCanvas();
                invokeCall();
            }

            let StartCoord = "" + StartCenterX + ", " + StartcenterY;

            if (BombReferenceCoord.indexOf(StartCoord) !== -1) {
                StartCenterX += dim;
                UpdateStartCanvas();
            }

            let targetCoord = "" + targetCenterX + ", " + targetcenterY;

            if (BombReferenceCoord.indexOf(targetCoord) !== -1) {
                targetCenterX += dim;
                UpdateTargetCanvas();
            }

            setTimeout(check, 1);
        }

        check();
    }

    checkConflict();

    function Euclidean(Node, Target) {
      return Math.sqrt(
        Math.pow(Node.x - Target.x, 2) + Math.pow(Node.y - Target.y, 2)
      );
    }

    function ManhattanDistance(Node, Target) {
        return Math.abs(Node.i - Target.i) + Math.abs(Node.j - Target.j);
    }

    function PathEuclidean(Queue, Target) {
      let SumOfLengths = 0;

      for (let x = 0; x < Queue.length - 1; x++) {
        SumOfLengths += ManhattanDistance(Queue[x], Queue[x + 1]);
      }

      let F = SumOfLengths + ManhattanDistance(Queue[Queue.length-1], Target);
      return F;
    }

    function getNode(i, j) {
        let row = i;
        let column = j;
        let selectednode;

        for (let i = 0; i < ComponentNodes.length; i++) {
            let node = ComponentNodes[i];

            if (node.i == row && node.j == column) {
                selectednode = node
                break;
            }
        }

        return selectednode;
    }

    function GenerateMazeNodesSystem() {
        mazed = true;
        let range = 0;
        let keypos = 0;
        let keymap = [];
        let selectednode = getNode(0, 0);
        if (recurInvert) selectednode = getNode(1, 1);
        keymap[keypos] = [selectednode];
        let keypath = keymap[keypos];
        let blockpaths = [keypath];

        function GenerateMaze() {

            for (let i = 0; i < ComponentNodes.length; i++) {
                let node = ComponentNodes[i];

                node.blocked = false;
            }

            let indices = [];
            let network = [];
            let maze = [];

            function GriddingBlocks() {

                let lap = 5;
                let start = 0;
                let counter = 0;
                let end = start + lap;

                function Build() {

                    for (let x = 0; x < blockpaths.length; x++) {

                        let vectorarray = blockpaths[x];

                        if (vectorarray.length == 1) {

                            let currentnode = vectorarray[0];
                            network.push(currentnode);
                            let indexmap = "" + currentnode.i + ", " + currentnode.j;
                            indices.push(indexmap);

                        } else {

                            for (let y = 0; y < vectorarray.length; y += 1) {

                                let size = vectorarray.length;
                                let currentnode = vectorarray[y];

                                let indexmap = "" + currentnode.i + ", " + currentnode.j;

                                if (indices.indexOf(indexmap) == -1) {
                                    indices.push(indexmap);
                                    network.push(currentnode);
                                }

                                if (y < size - 1) {

                                    let nextnode = vectorarray[y + 1];
                                    let refai = currentnode.i;
                                    let refaj = currentnode.j;

                                    let refbi = nextnode.i;
                                    let refbj = nextnode.j;

                                    let midi;
                                    let midj;

                                    if (refai == refbi) {
                                        midi = refai;
                                    } else {
                                        midi = Math.floor((refai + refbi) / 2);
                                    }

                                    if (refaj == refbj) {
                                        midj = refaj;
                                    } else {
                                        midj = Math.floor((refaj + refbj) / 2);
                                    }

                                    let Othernode = getNode(midi, midj);

                                    indexmap = "" + Othernode.i + ", " + Othernode.j;

                                    if (indices.indexOf(indexmap) == -1) {
                                        indices.push(indexmap);
                                        network.push(Othernode);
                                    }

                                    indexmap = "" + nextnode.i + ", " + nextnode.j;

                                    if (indices.indexOf(indexmap) == -1) {
                                        indices.push(indexmap);
                                        network.push(nextnode);
                                    }

                                }
                            }
                        }
                    }

                    for (let x = 0; x < ComponentNodes.length && recurInvert; x++) {
                        let currentnode = ComponentNodes[x];

                        let indexmap = "" + currentnode.i + ", " + currentnode.j;

                        if (indices.indexOf(indexmap) == -1) {
                            indices.push(indexmap);
                            maze.push(currentnode);
                        }
                    }

                    function matplot() {
                        let simulatearray = [];

                        for (let x = start; x < maze.length && recurInvert; x++) {
                            let node = maze[x];
                            simulatearray.push(node);
                        }

                        for (let x = start; x < network.length && !recurInvert; x++) {
                            let node = network[x];
                            simulatearray.push(node);
                        }

                        const go = setInterval(() => {
                            if (start < simulatearray.length) {
                                let node = simulatearray[start];
                                node.block();
                                start++;
                            } else {
                                clearInterval(go);
                            }
                        }, 10);
                    }

                    matplot();

                }


                Build();
            }

            GriddingBlocks();

        }

        function CalculateGridNodes() {

            let currentnode = keypath[keypath.length - 1];
            currentnode.blocked = true;

            let neighbours = currentnode.getNeighbours();

            if (neighbours.length !== 0) {

                let extensions = [];
                let enqueueing = keypath;

                for (let x = 0; x < neighbours.length; x++) {

                    let node = neighbours[x];
                    enqueueing.push(node);

                    extensions[x] = [];

                    for (let y = 0; y < enqueueing.length; y++) {
                        extensions[x].push(enqueueing[y]);
                    }

                    keymap.push(extensions[extensions.length - 1]);

                    enqueueing.pop();
                }

                let min = keymap.length - neighbours.length;
                let max = keymap.length;
                let rand = Math.floor(Math.random() * (max - min)) + min;

                keypath = keymap[rand];
                blockpaths.push(keypath);

                keypos++;

                CalculateGridNodes();

            } else {
                let len = keypath.length;

                while (true) {
                    let isFoundPath = false;

                    for (let x = 0; x < keymap.length; x++) {

                        let nodearray = keymap[x];

                        if (nodearray.length == len) {

                            let node = nodearray[nodearray.length - 1];

                            if (!node.blocked) {
                                isFoundPath = true;

                                keypath = nodearray;
                                blockpaths.push(keypath);
                                break;
                            }
                        }
                    }

                    if (isFoundPath) {
                        CalculateGridNodes();
                        break;
                    } else {
                        len--;

                        if (len < 1) {
                            console.log(keymap.length);
                            console.log(blockpaths.length);
                            console.log(blockpaths);
                            GenerateMaze();
                            // alert("f");
                            break;
                        }
                    }
                }
            }

        }

        CalculateGridNodes();
    }

    recur[0].addEventListener("click", () => {
        recurInvert = false;
        clearWallsAndWeights();
        GenerateMazeNodesSystem();
    });

    recurInverse[0].addEventListener("click", () => {
        recurInvert = true;
        clearWallsAndWeights();
        GenerateMazeNodesSystem();
    });

    function RecursiveDivisionMethod(type=0) {
        mazed = true;
        let keymap = [];

        for (let a = 0; a < num; a++) {
            let node = getNode(a, 0);
            keymap.push(node);
        }

        for (let b = 0; b < num; b++) {
            let node = getNode(b, col - 1);
            keymap.push(node);
        }

        for (let c = 0; c < col; c++) {
            let node = getNode(0, c);
            keymap.push(node);
        }

        for (let d = 0; d < col; d++) {
            let node = getNode(num - 1, d);
            keymap.push(node);
        }

        let range = -80;
        let Fields = [];
        let rands = [];

        Fields[0] = [1, num - 1, 1, col - 1];
        // Fields[0] = [71, 74, 28, 30];
        let traversed = [];

        function getHeightBreadth(currentpath) {
            let xrefstart = currentpath[0];
            let xrefend = currentpath[1];
            let yrefstart = currentpath[2];
            let yrefend = currentpath[3];

            let height = yrefend - yrefstart;
            let breadth = xrefend - xrefstart;

            return [height, breadth];
        }

        function getId(currentpath) {
            let xrefstart = currentpath[0];
            let xrefend = currentpath[1];
            let yrefstart = currentpath[2];
            let yrefend = currentpath[3];

            let id = xrefstart + ", " + xrefend + ", " + yrefstart + ", " + yrefend;
            return id;
        }

        function matplot() {
            let start = 0;

            const go = setInterval(() => {
                if (start < keymap.length) {
                    let node = keymap[start];
                    // node.ratio = 4;
                    node.block();
                    start += 1;
                } else {
                    clearInterval(go);
                }
            }, 0);
        }

        function CalculateGridNodes() {

            let len = Fields.length;
            console.log("len is : " + len);

            let currentpath = Fields[Fields.length - 1];
            // console.log(Fields[Fields.length - 1]);
            let xrefstart = currentpath[0];
            let xrefend = currentpath[1];
            let yrefstart = currentpath[2];
            let yrefend = currentpath[3];

            let Finish = false;

            while (true) {
                let id = getId(currentpath);

                if (traversed.indexOf(id) !== -1) {
                    Fields.pop();
                    len = Fields.length;
                    if (len < 1) {
                        Finish = true;
                        break;
                    }
                    currentpath = Fields[Fields.length - 1];

                    xrefstart = currentpath[0];
                    xrefend = currentpath[1];
                    yrefstart = currentpath[2];
                    yrefend = currentpath[3];
                } else {
                    break;
                }
            }

            if (Finish) {
                matplot();
                return;
            }

            let VERTICAL = true;

            let height = yrefend - yrefstart;
            let breadth = xrefend - xrefstart;

            // console.log("height : " + height + ", breadth : " + breadth);

            if (true) {
                // console.log("going to go");
                switch (type) {
                  case 1:
                    if (height > 5 * breadth) {
                      VERTICAL = false;
                    }
                    break;
                  case 2:
                    if (breadth < 8 * height) {
                      VERTICAL = false;
                    }
                    break;
                  case 3:
                    if (breadth < 3 * height) {
                      VERTICAL = false;
                    }
                    break;
                  default:
                    if (height > breadth) {
                      VERTICAL = false;
                    }
                }

                if (VERTICAL) {

                    let length = (yrefend - yrefstart);

                    let keyindex = Math.floor((xrefstart + xrefend) / 2);

                    keyindex = Math.floor(Math.random() * ((xrefend) - (xrefstart))) + xrefstart;

                    keyindex = (keyindex % 2 == 0) ? keyindex : (keyindex + 1);

                    let rand = Math.floor(Math.random() * (yrefend - yrefstart)) + yrefstart;

                    rand = (rand % 2 == 0) ? rand + 1 : rand;

                    for (let x = yrefstart; x <= yrefend; x++) {
                        if (x !== rand) keymap.push(getNode(keyindex, x));
                    }

                    let a = getHeightBreadth([xrefstart, keyindex - 1, yrefstart, yrefend]);

                    if (a[0] <= 1 || a[1] <= 1) {} else {
                        // alert("add 1");
                        Fields.push([xrefstart, keyindex - 1, yrefstart, yrefend]);
                    }

                    let b = getHeightBreadth([keyindex + 1, xrefend, yrefstart, yrefend]);

                    if (b[0] <= 1 || b[1] <= 1) {} else {
                        // alert("add 2");
                        Fields.push([keyindex + 1, xrefend, yrefstart, yrefend]);
                    }

                    let another = Fields.length;
                    console.log("another is : " + another);

                    if (another > len) {
                        traversed.push(getId(currentpath));

                        CalculateGridNodes();
                    } else {
                        console.log("Finished " + Fields.length);

                        Fields.pop();
                        // Fields.pop();
                        // alert("going back");
                        console.log("Finished again " + Fields.length);
                        // alert("finsied " + range);
                        // alert("a0 : " + a[0] + ", a1 : " + a[1] + ", b0 : " + b[0] + ", b1 : " + b[1]);

                        CalculateGridNodes();
                    }

                } else {
                    let length = (yrefend - yrefstart);

                    keyindex = Math.floor(Math.random() * ((yrefend) - (yrefstart))) + yrefstart;

                    keyindex = (keyindex % 2 == 0) ? keyindex : (keyindex + 1);
                    // alert("keyindex : " + keyindex);

                    let rand = Math.floor(Math.random() * (xrefend - xrefstart)) + xrefstart;

                    rand = (rand % 2 == 0) ? rand + 1 : rand;

                    for (let x = xrefstart; x <= xrefend; x++) {
                        if (x !== rand) keymap.push(getNode(x, keyindex));
                    }

                    let a = getHeightBreadth([xrefstart, xrefend, yrefstart, keyindex - 1]);

                    if (a[0] <= 1 || a[1] <= 1) {} else {
                        console.log("add");
                        Fields.push([xrefstart, xrefend, yrefstart, keyindex - 1]);
                    }

                    let b = getHeightBreadth([xrefstart, xrefend, keyindex + 1, yrefend]);

                    if (b[0] <= 1 || b[1] <= 1) {} else {
                        console.log("add");
                        Fields.push([xrefstart, xrefend, keyindex + 1, yrefend]);
                    }

                    let another = Fields.length;
                    console.log("another is : " + another);

                    if (another > len) {
                        traversed.push(getId(currentpath));
                        console.log("claling rgrid");
                        CalculateGridNodes();
                    } else {
                        console.log("Finished " + Fields.length);
                        Fields.pop();
                        // alert("going back");
                        // Fields.pop();
                        console.log("Finished again " + Fields.length);
                        // alert("finsied " + range);
                        // alert("a0 : " + a[0] + ", a1 : " + a[1] + ", b0 : " + b[0] + ", b1 : " + b[1]);

                        CalculateGridNodes();

                    }
                }
            }


        }

        CalculateGridNodes();
    }

    recursiveDiv[0].addEventListener("click", () => {
        clearWallsAndWeights();
        RecursiveDivisionMethod();
    });

    recursiveVertical[0].addEventListener("click", () => {
      clearWallsAndWeights();
      RecursiveDivisionMethod(1);
    });

    recursiveHorizontal[0].addEventListener("click", () => {
      clearWallsAndWeights();
      RecursiveDivisionMethod(2);
    });

    recursiveOptimal[0].addEventListener("click", () => {
      clearWallsAndWeights();
      RecursiveDivisionMethod(3);
    });

    function Dijkstra(bomb = false, alpha = false) {
        let SOLVED = false;
        WeightedSearch = false;
        DijkstraSearch = true;
        GreedyBestFirst = false;
        Swarm = false;
        let Enqueueing = [];
        let ExtendedNodesIndex = [];
        let StartingNode, TargetNode;

        for (let x = 0; x < ComponentNodes.length; x++) {
          let currentnode = ComponentNodes[x];

          if (alpha) {
            if (currentnode.hasBomb) {
              StartingNode = currentnode;
            } else if (currentnode.isTarget) {
              TargetNode = currentnode;
            }
          } else if (currentnode.isStart) {
            StartingNode = currentnode;
          } else if (currentnode.isTarget) {
            TargetNode = currentnode;
          }

          if (StartingNode != undefined && TargetNode != undefined) break;
        }

        function SortEnqueueing(Enqueueing) {
          let EqualizedRand = 0;

          for (let x = 0; x < Enqueueing.length; x++) {
            for (let y = 0; y < Enqueueing.length - (x + 1); y++) {
              if (Enqueueing[y][1] > Enqueueing[y + 1][1]) {
                let changedQueue = Enqueueing[y];
                Enqueueing[y] = Enqueueing[y + 1];
                Enqueueing[y + 1] = changedQueue;
              }
            }
          }

          for (let x = 0; x < Enqueueing.length; x++) {
            if (Enqueueing[x][1] == Enqueueing[0][1]) {
              EqualizedRand++;
            }
          }

          return EqualizedRand;
        }

        function SimulateGridSearch(Queue) {
          let Start = 0;

          const Interval = setInterval(() => {
            if (Start < Queue.length) {
              let Node = Queue[Start];

              Node.blocked = false;

              if (!Node.traced) {
                Node.clear();
                Node.Trace();
              } else {
                // setTimeout(() => {
                //   Node.clear();
                //   Node.Trace();
                // }, 500);
              }

              Start++;
            } else {
              clearInterval(Interval);
            }
          }, 50);
        }

        function SortChildNodes(ChildNodes) {

          for (let x = 0; x < ChildNodes.length; x++) {
            for (let y = 0; y < ChildNodes.length - (x + 1); y++) {
              if (
                ManhattanDistance(ChildNodes[y], TargetNode) >
                ManhattanDistance(ChildNodes[y + 1], TargetNode)
              ) {
                let changedQueue = ChildNodes[y];
                ChildNodes[y] = ChildNodes[y + 1];
                ChildNodes[y + 1] = changedQueue;
              }
            }
          }

        }

        Enqueueing.unshift([[StartingNode], 0]);

        let QueueToExtendFirst = Enqueueing.shift();

        function CalculateGridNodes(QueueToExtendArray) {

            if(!SOLVED) {

                let QueueToExtend = QueueToExtendArray[0];
                let NodeToExtend = QueueToExtend[QueueToExtend.length - 1];

                if (bomb) {
                  if (NodeToExtend.hasBomb) {
                    Enqueueing = [];
                    ExtendedNodesIndex = [];

                    CleverPath = CleverPath.concat(QueueToExtend);

                    SOLVED = true;

                    for (let x = 0; x < ComponentNodes.length; x++) {
                      let node = ComponentNodes[x];
                      if (node.tested) node.blocked = false;
                    }

                    setTimeout(() => {
                      Dijkstra(false, true);
                    }, 300);

                    return;
                  }
                } else if (NodeToExtend.isTarget) {
                  SOLVED = true;

                  let path = QueueToExtend;

                  if(alpha) path = QueueToExtend.slice(1, QueueToExtend.length);
                  CleverPath = CleverPath.concat(path);

                  setTimeout(() => {
                    SimulateGridSearch(CleverPath);
                  }, 300);

                  return;
                }

                let NodeIndexMap = "" + NodeToExtend.i + "," + NodeToExtend.j;

                if (ExtendedNodesIndex.indexOf(NodeIndexMap) == -1) {
                    ExtendedNodesIndex.push(NodeIndexMap);

                    let Neighbours = NodeToExtend.getChildNodes();
                    SortChildNodes(Neighbours);

                    let position = 0;
                    Neighbours[position].mark();

                    const reanimateframe = setInterval(() => {

                      if (position < Neighbours.length) {

                        let Node = Neighbours[position];

                        if (alpha) {
                          Node.clear();

                          Node.first = "rgb(99, 18, 59)";
                          Node.second = "rgb(214, 3, 109)";
                          Node.third = "rgb(230, 150, 190)";

                          if (position < Neighbours.length - 1) {
                            Neighbours[position + 1].mark();
                          }

                          Node.testblock();
                        } else if (!Node.blocked) {
                          Node.testblock();

                          if (position < Neighbours.length - 1) {
                            Neighbours[position + 1].mark();
                          }
                        }

                        position++;
                      } else {
                        let init = 0;
                        let Extensions = [];
                        let Travel = QueueToExtendArray[1];

                        const reiterate = setInterval(()=>{

                           if (init < Neighbours.length) {
                             let Node = Neighbours[init];
                             Extensions[init] = QueueToExtend.slice();
                             Extensions[init].push(Node);

                             Enqueueing.push([Extensions[init], Travel + 1]);

                             init++;
                           }else{

                             SortEnqueueing(Enqueueing);

                             if (Enqueueing.length !== 0) {
                                let QueueToExtendNext = Enqueueing.shift();
                                CalculateGridNodes(QueueToExtendNext);
                             }

                             clearInterval(reiterate);
                           }

                        }, 0);

                        clearInterval(reanimateframe);
                      }

                    }, SPEED * 100);
                }else{
                    
                    if (Enqueueing.length !== 0) {
                      let QueueToExtendNext = Enqueueing.shift();
                      CalculateGridNodes(QueueToExtendNext);
                    }
                }
            }
        }

        CalculateGridNodes(QueueToExtendFirst);
    }

    DijkstraBtn[0].addEventListener("click", () => {
        CleverPath = [];
        resetSearch();
        Dijkstra(addbomb);
    });

    function GreedyBestSearch(bomb = false, alpha = false) {
      let range = 0;
      let SOLVED = false;
      WeightedSearch = false;
      DijkstraSearch = false;
      GreedyBestFirst = true;
      Swarm = false;

      let EveryUnvisitedNode = [];
      let Enqueueing = [];
      let ExtendedNodesIndex = [];
      let StartingNode, TargetNode;

      for (let x = 0; x < ComponentNodes.length; x++) {
        let currentnode = ComponentNodes[x];

        if(bomb){
            if (currentnode.isStart) {
              StartingNode = currentnode;
            } else if (currentnode.hasBomb) {
              TargetNode = currentnode;
            }
        }
        else if (alpha) {
            if (currentnode.hasBomb) {
                StartingNode = currentnode;
            } else if (currentnode.isTarget) {
                TargetNode = currentnode;
            }
        } else if (currentnode.isStart) {

          StartingNode = currentnode;

        } else if (currentnode.isTarget) {

          TargetNode = currentnode;
          
        }

        if (StartingNode != undefined && TargetNode != undefined) break;
      }

      function SortEnqueueing(Enqueueing) {
  
        for (let x = 0; x < Enqueueing.length; x++) {
          for (let y = 0; y < Enqueueing.length - (x + 1); y++) {

              if (Enqueueing[y][1] > Enqueueing[y + 1][1]) {
                if(true){

                  let changedQueue = Enqueueing[y];
                  Enqueueing[y] = Enqueueing[y + 1];
                  Enqueueing[y + 1] = changedQueue;

                }
              }
          }
        }

        return Enqueueing[0];

      }

      function SimulateGridSearch(Queue) {
        let Start = 0;

        const Interval = setInterval(() => {
          if (Start < Queue.length) {
            let Node = Queue[Start];

            Node.blocked = false;

            if (!Node.traced) {
              Node.clear();
              Node.Trace();
            } else {
              // setTimeout(() => {
              //   Node.clear();
              //   Node.Trace();
              // }, 500);
            }

            Start++;
          } else {
            clearInterval(Interval);
          }
        }, 50);
      }

      function SortChildNodes(ChildNodes) {

        for (let x = 0; x < ChildNodes.length; x++) {

          for (let y = 0; y < ChildNodes.length - (x + 1); y++) {
            if (
              ManhattanDistance(ChildNodes[y], TargetNode) >
              ManhattanDistance(ChildNodes[y + 1], TargetNode)
            ) {
              let changedQueue = ChildNodes[y];
              ChildNodes[y] = ChildNodes[y + 1];
              ChildNodes[y + 1] = changedQueue;
            }
          }

        }
      }

      Enqueueing.unshift([[StartingNode], ManhattanDistance(StartingNode, TargetNode)]);

      let QueueToExtendFirst = Enqueueing.shift();

      function CalculateGridNodes(QueueToExtendArray) {
        range++;
        if (!SOLVED) {
          let QueueToExtend = QueueToExtendArray[0];
          let NodeToExtend = QueueToExtend[QueueToExtend.length - 1];

          if (bomb) {
            if (NodeToExtend.hasBomb) {
              Enqueueing = [];
              ExtendedNodesIndex = [];
              EveryUnvisitedNode = [];
              ExtendedNodesIndex = [];

              CleverPath = CleverPath.concat(QueueToExtend);

              SOLVED = true;

              for (let x = 0; x < ComponentNodes.length; x++) {
                let node = ComponentNodes[x];
                if (node.tested) node.blocked = false;
              }

              setTimeout(() => {
                GreedyBestSearch(false, true);
              }, 500);

              return;
            }
          } else if (NodeToExtend.isTarget) {
            SOLVED = true;

            let path = QueueToExtend;

            if (alpha) path = QueueToExtend.slice(1, QueueToExtend.length);
            CleverPath = CleverPath.concat(path);

            setTimeout(() => {
              SimulateGridSearch(CleverPath);
            }, 300);

            return;
          }

          let NodeIndexMap = "" + NodeToExtend.i + "," + NodeToExtend.j;

          if (ExtendedNodesIndex.indexOf(NodeIndexMap) == -1) {
            ExtendedNodesIndex.push(NodeIndexMap);

            if(!NodeToExtend.tested) NodeToExtend.testblock();

            let Neighbours = NodeToExtend.getChildNodes();
            SortChildNodes(Neighbours);

            Neighbours[0].mark();

            if(Neighbours.length == 0) {

              if (Enqueueing.length !== 0) {

                let QueueToExtendNext = Enqueueing.shift();
                CalculateGridNodes(QueueToExtendNext);

              }

              return;
            }

            const reanimateframe = () => {

              let Node = Neighbours[0];

              if (alpha) {
                Node.clear();

                Node.first = "rgb(99, 18, 59)";
                Node.second = "rgb(214, 3, 109)";
                Node.third = "rgb(230, 150, 190)";

                Node.testblock();
              } else {
                Node.testblock();
              }

              let init = 0;
              let Extensions = [];

              const reiterate = setInterval(() => {
                if (init < Neighbours.length) {
                  let Node = Neighbours[init];
                  Extensions[init] = QueueToExtend.slice();
                  Extensions[init].push(Node);

                  Enqueueing.push([Extensions[init], ManhattanDistance(Node, TargetNode)]);

                  init++;
                } else {

                  if (Enqueueing.length !== 0) {
                    let QueueToExtendNext = SortEnqueueing(Enqueueing, Node);
                    CalculateGridNodes(QueueToExtendNext);
                  }

                  clearInterval(reiterate);
                }
              }, 0);

            }

            setTimeout(reanimateframe, SPEED * 100);

          } else {

            if (Enqueueing.length !== 0) {
              let QueueToExtendNext = Enqueueing.shift();
              CalculateGridNodes(QueueToExtendNext);
            }

          }
        }
      }

      CalculateGridNodes(QueueToExtendFirst);
    }

    GreedySearchBtn[0].addEventListener("click", () => {
      CleverPath = [];
      resetSearch();
      GreedyBestSearch(addbomb);
    });

    let done = true;

    const isItDoneYet = new Promise((resolve, reject) => {

        if (done) {
            const WorkDone = "Here is the thing I built";
            resolve(WorkDone);
        } else {
            const Why = "Still working on something else";
            reject(Why);
        }

    });

    const checkIfItsDone = () => {

        isItDoneYet
            .then((ok) => {
                alert(ok);
            })
            .catch((err) => {
                alert(err);
            });
    }

    function AstarSearchAlgorithm(bomb = false, alpha = false, change = false) {
      let range = 0;
      WeightedSearch = true;
      DijkstraSearch = false;
      GreedyBestFirst = false;
      Swarm = false;

      let Enqueueing = [];
      let ExtendedNodesIndex = [];
      let StartingNode, TargetNode;
      let NodesToTest = [];

      for (let x = 0; x < ComponentNodes.length; x++) {
        let currentnode = ComponentNodes[x];

        if(alpha){
            if(currentnode.hasBomb){
                StartingNode = currentnode;
            }else if(currentnode.isTarget){
                TargetNode = currentnode;
            }
        }
        else if (currentnode.isStart) {
          StartingNode = currentnode;
        } else if (currentnode.isTarget) {
          TargetNode = currentnode;
        }

        if (StartingNode != undefined && TargetNode != undefined) break;
      }

      Enqueueing.unshift([[StartingNode], Euclidean(StartingNode, TargetNode)]);

      function SimulateGridSearch(Queue) {

        if(change){
            resetSearch();

            const respawn = () => {
                for (let i = 0; i < NodesToTest.length; i++) {
                  NodesToTest[i].testblock(true);
                }

                for (let i = 0; i < Queue.length; i++) {
                  let Node = Queue[i];

                  Node.blocked = false;

                  if (!Node.traced) {
                    Node.clear();
                    Node.Trace(true);
                  }
                }
            }

            respawn();
        }

        let Start = 0;

        const Interval = setInterval(() => {
          if (Start < Queue.length) {
            let Node = Queue[Start];

            Node.blocked = false;

            if (!Node.traced) {
              Node.clear();
              Node.Trace();
            }else{
              // setTimeout(()=>{
              //   Node.clear();
              //   Node.Trace();
              // }, 500);
            }

            Start++;
          } else {
            clearInterval(Interval);
          }
        }, 50);
      }

      function SortEnqueueing(Enqueueing) {

        for (let x = 0; x < Enqueueing.length; x++) {

          for (let y = 0; y < Enqueueing.length - (x + 1); y++) {

            if (Enqueueing[y][1] > Enqueueing[y + 1][1]) {

              let changedQueue = Enqueueing[y];
              Enqueueing[y] = Enqueueing[y + 1];
              Enqueueing[y + 1] = changedQueue;

            }

          }

        }

      }

      function CalculateGridNodes() {
        range++;
        let QueueToExtend = Enqueueing.shift();
        let QueueNodes = QueueToExtend[0];
        let NodeToExtend = QueueNodes[QueueNodes.length - 1];

        if(bomb){
            if (NodeToExtend.hasBomb) {
              Enqueueing = [];
              ExtendedNodesIndex = [];
              if (change) NodesToTest.push(NodeToExtend);
              else NodeToExtend.testblock();

              CleverPath = CleverPath.concat(QueueNodes);

              for (let x = 0; x < ComponentNodes.length; x++) {
                let node = ComponentNodes[x];
                if (node.tested) node.blocked = false;
              }

              setTimeout(()=>{
                AstarSearchAlgorithm(false, true, change);
              }, 1000);
              

              return;
            }
        }else if (NodeToExtend.isTarget) {
          Enqueueing = [];
          ExtendedNodesIndex = [];

          if (alpha) {
            NodeToExtend.first = "rgb(99, 18, 59)";
            NodeToExtend.second = "rgb(214, 3, 109)";
            NodeToExtend.third = "rgb(230, 150, 190)";

            NodeToExtend.clear();
          }

          NodeToExtend.testblock();

          let path = QueueNodes;
          if (alpha) path = QueueNodes.slice(1, QueueNodes.length);
          CleverPath = CleverPath.concat(path);

          setTimeout(()=>{
            SimulateGridSearch(CleverPath);
          }, 500)

          return;
        }

        let NodeIndexMap = "" + NodeToExtend.i + "," + NodeToExtend.j;

        if (ExtendedNodesIndex.indexOf(NodeIndexMap) == -1) {
          ExtendedNodesIndex.push(NodeIndexMap);
        
          if(alpha){
              NodeToExtend.first = "rgb(99, 18, 59)";
              NodeToExtend.second = "rgb(214, 3, 109)";
              NodeToExtend.third = "rgb(230, 150, 190)";

              NodeToExtend.clear();
              NodeToExtend.testblock();
          }else {
              NodeToExtend.clear();
              NodeToExtend.testblock();
          }

          let Neighbours = NodeToExtend.getChildNodes();

          let Extensions = [];
          let ExtendedLength = Extensions.length;
          let ExtendedPath = QueueNodes;

          for (let x = 0; x < Neighbours.length; x++) {
            let Node = Neighbours[x];
            ExtendedPath.push(Node);

            Extensions[x] = [];

            for (let y = 0; y < ExtendedPath.length; y++) {
              Extensions[x].push(ExtendedPath[y]);
            }

            let Target = TargetNode;
            if(bomb) Target = BombDragNode;

            Enqueueing.unshift(
                [
                 Extensions[x],
                 PathEuclidean(Extensions[x], Target)
                ]
            );

            ExtendedPath.pop();
          }

          SortEnqueueing(Enqueueing);

          let QueueToMark = Enqueueing[0];
          let NodesToMark = QueueToMark[0];
          let NodeToMark = NodesToMark[NodesToMark.length - 1];
          if(!NodeToMark.blocked) NodeToMark.mark();

          setTimeout(CalculateGridNodes, SPEED * 150);

        } else {
          if (Enqueueing.length !== 0) {
            CalculateGridNodes();
          }
        }
      }

      CalculateGridNodes();
    }

    AStar[0].addEventListener("click", () => {
      CleverPath = [];
      resetSearch();
      AstarSearchAlgorithm(addbomb, false, false);
    });

    const randomGenerator = () => {
        mazed = true;
        let Pattern = [];

        for(let i = 0; i < ComponentNodes.length; i++){
            let test = getRandomInteger(1, 100);
            if(test%5 == 0) Pattern.push(ComponentNodes[i]);
        }

        for (let i = 0; i < Pattern.length; i++) {
            let node = Pattern[i];
            node.ratio = 1;
            node.block();
        }
    }

    randomMaze[0].addEventListener("click", () => {
      mazed = true;
      clearWallsAndWeights();
      randomGenerator();
    });

    const StairPatternGenerator = () => {
      mazed = true;
      let Pattern = [];

      let i = 1, j = col-2, x = -1;

      while(i < num-1){

        let node = getNode(i, j);
        Pattern.push(node);
        i++;
        j += x;
        if(j == 1 && i < num-1) x = 1;
        if(j == col-2 && i < num-1) x = -1;
      }

      for(let i = 0; i < Pattern.length; i++){
        Pattern[i].block();
      }
    };

    StairMaze[0].addEventListener("click", () => {

      StartCenterX = dim * (Math.floor(num * 0.15));
      targetCenterX = dim * Math.floor(num * 0.85);
      UpdateStartCanvas();
      UpdateTargetCanvas();

      mazed = true;
      clearWallsAndWeights();
      StairPatternGenerator();
    });

    function ConvergentSwarm(bomb = false, alpha = false) {
      let SOLVED = false;
      WeightedSearch = false;
      DijkstraSearch = false;
      GreedyBestFirst = false;
      Swarm = true;

      let Enqueueing = [];
      let ExtendedNodesIndex = [];
      let StartingNode, TargetNode;

      for (let x = 0; x < ComponentNodes.length; x++) {
        let currentnode = ComponentNodes[x];

        if (alpha) {
          if (currentnode.hasBomb) {
            StartingNode = currentnode;
          } else if (currentnode.isTarget) {
            TargetNode = currentnode;
          }
        } else if (currentnode.isStart) {
          StartingNode = currentnode;
        } else if (currentnode.isTarget) {
          TargetNode = currentnode;
        }

        if (StartingNode != undefined && TargetNode != undefined) break;
      }

      function SortEnqueueing(Enqueueing) {
        let EqualizedRand = 0;

        for (let x = 0; x < Enqueueing.length; x++) {
          for (let y = 0; y < Enqueueing.length - (x + 1); y++) {
            if (Enqueueing[y][1] > Enqueueing[y + 1][1]) {
              let changedQueue = Enqueueing[y];
              Enqueueing[y] = Enqueueing[y + 1];
              Enqueueing[y + 1] = changedQueue;
            }
          }
        }

        for (let x = 0; x < Enqueueing.length; x++) {
          if (Enqueueing[x][1] == Enqueueing[0][1]) {
            EqualizedRand++;
          }
        }

        return EqualizedRand;
      }

      function SimulateGridSearch(Queue) {
        let Start = 0;

        const Interval = setInterval(() => {
          if (Start < Queue.length) {
            let Node = Queue[Start];

            Node.blocked = false;

            if (!Node.traced) {
              Node.clear();
              Node.Trace();
            } else {
              // setTimeout(() => {
              //   Node.clear();
              //   Node.Trace();
              // }, 500);
            }

            Start++;
          } else {
            clearInterval(Interval);
          }
        }, 50);
      }

      function SortChildNodes(ChildNodes) {
        for (let x = 0; x < ChildNodes.length; x++) {
          for (let y = 0; y < ChildNodes.length - (x + 1); y++) {
            if (
              ManhattanDistance(ChildNodes[y], TargetNode) >
              ManhattanDistance(ChildNodes[y + 1], TargetNode)
            ) {
              let changedQueue = ChildNodes[y];
              ChildNodes[y] = ChildNodes[y + 1];
              ChildNodes[y + 1] = changedQueue;
            }
          }
        }
      }

      Enqueueing.unshift([[StartingNode], 0]);

      let QueueToExtendFirst = Enqueueing.shift();

      function CalculateGridNodes(QueueToExtendArray) {
        if (!SOLVED) {
          let QueueToExtend = QueueToExtendArray[0];
          let NodeToExtend = QueueToExtend[QueueToExtend.length - 1];

          if (bomb) {
            if (NodeToExtend.hasBomb) {
              Enqueueing = [];
              ExtendedNodesIndex = [];

              CleverPath = CleverPath.concat(QueueToExtend);

              SOLVED = true;

              for (let x = 0; x < ComponentNodes.length; x++) {
                let node = ComponentNodes[x];
                if (node.tested) node.blocked = false;
              }

              setTimeout(() => {
                ConvergentSwarm(false, true);
              }, 300);

              return;
            }
          } else if (NodeToExtend.isTarget) {
            SOLVED = true;

            let path = QueueToExtend;

            if (alpha) path = QueueToExtend.slice(1, QueueToExtend.length);
            CleverPath = CleverPath.concat(path);

            setTimeout(() => {
              SimulateGridSearch(CleverPath);
            }, 300);

            return;
          }

          let NodeIndexMap = "" + NodeToExtend.i + "," + NodeToExtend.j;

          if (ExtendedNodesIndex.indexOf(NodeIndexMap) == -1) {
            ExtendedNodesIndex.push(NodeIndexMap);

            let Neighbours = NodeToExtend.getChildNodes();
            SortChildNodes(Neighbours);

            let position = 0;
            Neighbours[position].mark();

            const reanimateframe = setInterval(() => {
              if (position < Neighbours.length) {
                let Node = Neighbours[position];

                if (alpha) {
                  Node.clear();

                  Node.first = "rgb(99, 18, 59)";
                  Node.second = "rgb(214, 3, 109)";
                  Node.third = "rgb(230, 150, 190)";

                  if (position < Neighbours.length - 1) {
                    Neighbours[position + 1].mark();
                  }

                  Node.testblock();
                } else if (!Node.blocked) {
                  Node.testblock();

                  if (position < Neighbours.length - 1) {
                    Neighbours[position + 1].mark();
                  }
                }

                position++;
              } else {
                let init = 0;
                let Extensions = [];
                let Travel = QueueToExtendArray[1];

                const reiterate = setInterval(() => {
                  if (init < Neighbours.length) {
                    let Node = Neighbours[init];
                    Extensions[init] = QueueToExtend.slice();
                    Extensions[init].push(Node);

                    Enqueueing.push([Extensions[init], (Travel + 1) + ManhattanDistance(Node, TargetNode)]);

                    init++;
                  } else {
                    SortEnqueueing(Enqueueing);

                    if (Enqueueing.length !== 0) {
                      let QueueToExtendNext = Enqueueing.shift();
                      CalculateGridNodes(QueueToExtendNext);
                    }

                    clearInterval(reiterate);
                  }
                }, 0);

                clearInterval(reanimateframe);
              }
            }, SPEED * 100);
          } else {
            if (Enqueueing.length !== 0) {
              let QueueToExtendNext = Enqueueing.shift();
              CalculateGridNodes(QueueToExtendNext);
            }
          }
        }
      }

      CalculateGridNodes(QueueToExtendFirst);
    }

    SwarmBtn[0].addEventListener("click", () => {
      CleverPath = [];
      resetSearch();
      ConvergentSwarm(addbomb);
    });

    function BidirectionalSwarm() {
      let SOLVED = false;
      WeightedSearch = false;
      DijkstraSearch = false;
      GreedyBestFirst = false;
      Swarm = false;

      let Enqueueing = [], Bidirectional = [], ExtendedChildren = [];
      let ExtendedNodesIndex = [], BidirectionalIndex = [], BidirectionalChildren = [];
      let StartingNode, TargetNode, ShiftedEnqueueings = [], ShiftedBidirections = [];

      for (let x = 0; x < ComponentNodes.length; x++) {
        let currentnode = ComponentNodes[x];

        if (currentnode.isStart) {
          StartingNode = currentnode;
        } else if (currentnode.isTarget) {
          TargetNode = currentnode;
        }

        if (StartingNode != undefined && TargetNode != undefined) break;
      }

      function SortEnqueueing(Enqueueing) {
        let EqualizedRand = 0;

        for (let x = 0; x < Enqueueing.length; x++) {
          for (let y = 0; y < Enqueueing.length - (x + 1); y++) {
            if (Enqueueing[y][1] > Enqueueing[y + 1][1]) {
              let changedQueue = Enqueueing[y];
              Enqueueing[y] = Enqueueing[y + 1];
              Enqueueing[y + 1] = changedQueue;
            }
          }
        }

        for (let x = 0; x < Enqueueing.length; x++) {
          if (Enqueueing[x][1] == Enqueueing[0][1]) {
            EqualizedRand++;
          }
        }

        return EqualizedRand;
      }

      function SimulateGridSearch(Queue) {
        let Start = 0;

        const Interval = setInterval(() => {
          if (Start < Queue.length) {
            let Node = Queue[Start];

            Node.blocked = false;

            if (!Node.traced) {
              Node.clear();
              Node.Trace();
            } else {
              // setTimeout(() => {
              //   Node.clear();
              //   Node.Trace();
              // }, 500);
            }

            Start++;
          } else {
            clearInterval(Interval);
          }
        }, 50);
      }

      function SortChildNodes(ChildNodes) {
        for (let x = 0; x < ChildNodes.length; x++) {
          for (let y = 0; y < ChildNodes.length - (x + 1); y++) {
            if (
              ManhattanDistance(ChildNodes[y], TargetNode) >
              ManhattanDistance(ChildNodes[y + 1], TargetNode)
            ) {
              let changedQueue = ChildNodes[y];
              ChildNodes[y] = ChildNodes[y + 1];
              ChildNodes[y + 1] = changedQueue;
            }
          }
        }
      }

      Enqueueing.unshift([[StartingNode], 0]);
      Bidirectional.unshift([[TargetNode], 0]);

      let QueueToExtendFirst = Enqueueing.shift();
      let BidirectionalQueue = Bidirectional.shift();

      function CalculateGridNodes(QueueToExtendArray, type) {
        if (!SOLVED) {
          let QueueToExtend = QueueToExtendArray[0];
          let NodeToExtend = QueueToExtend[QueueToExtend.length - 1];

          let NodeIndexMap = "" + NodeToExtend.i + "," + NodeToExtend.j;

          if(type){

            if (ExtendedNodesIndex.indexOf(NodeIndexMap) == -1) {
              ExtendedNodesIndex.push(NodeIndexMap);
              ExtendedChildren.push(NodeIndexMap);
              if(!NodeToExtend.en) NodeToExtend.en = true;

              let Neighbours = NodeToExtend.getChildNodes();
              SortChildNodes(Neighbours);

              let position = 0;
              Neighbours[position].mark();

              const reanimateframe = setInterval(() => {
                if (position < Neighbours.length) {
                  let Node = Neighbours[position];

                  if (!Node.blocked) {
                    Node.testblock();

                    if (position < Neighbours.length - 1) {
                      Neighbours[position + 1].mark();
                    }
                  }

                  position++;
                } else {

                  let init = 0;
                  let Extensions = [];
                  let Travel = QueueToExtendArray[1];

                  const reiterate = setInterval(() => {
                    if (init < Neighbours.length) {
                      let Node = Neighbours[init];
                      Extensions[init] = QueueToExtend.slice();
                      Extensions[init].push(Node);

                      Enqueueing.push([
                        Extensions[init],
                        Travel + 1 + ManhattanDistance(Node, TargetNode),
                      ]);

                      let NodeMap = "" + Node.i + "," + Node.j;
                      ExtendedChildren.push(NodeMap);
                      Node.en = true;

                      init++;
                    } else {

                      let EdgeNode = undefined;

                      for(let i = 0; i < Neighbours.length && !SOLVED; i++){
                        let Continue = true;
                        let Node = Neighbours[i];
                        let Children = Node.getChildNodes(true);

                        for(let j = 0; j < Children.length; j++){
                          let Child = Children[j];
                          if(Child.tested && Child.bi){
                            SOLVED = true;
                            Continue = false;
                            EdgeNode = Child;
                            QueueToExtend.push(Node);
                            QueueToExtend.push(EdgeNode);
                            break;
                          }
                        }

                        if(!Continue) break;
                      }

                      if(SOLVED){
                        if (EdgeNode !== undefined) {
                          let NodeMap = "" + EdgeNode.i + "," + EdgeNode.j;
                          if (BidirectionalIndex.indexOf(NodeMap) == -1) {
                            let PathA = [],
                              PathB = [];
                            PathA = QueueToExtend.slice();

                            for (let x = 0; x < Bidirectional.length; x++) {
                              let QueueArray = Bidirectional[x];
                              let QueueExtended = QueueArray[0];
                              let NodeExtended =
                                QueueExtended[QueueExtended.length - 1];

                              if (isEqual(EdgeNode, NodeExtended)) {
                                PathB = QueueExtended.slice();
                                break;
                              }
                            }

                            for(let y = PathB.length-1; y >= 0; y--){
                              PathA.push(PathB[y]);
                            }

                            setTimeout(() => {
                              SimulateGridSearch(PathA);
                            }, 1000);
                          } else {
                            let PathA = [],
                              PathB = [];
                            PathA = QueueToExtend.slice();

                            for (
                              let x = 0;
                              x < ShiftedBidirections.length;
                              x++
                            ) {
                              let QueueArray = ShiftedBidirections[x];
                              let QueueExtended = QueueArray[0];
                              let NodeExtended =
                                QueueExtended[QueueExtended.length - 1];

                              if (isEqual(EdgeNode, NodeExtended)) {
                                PathB = QueueExtended.slice();
                                break;
                              }
                            }

                            for (let y = PathB.length - 1; y >= 0; y--) {
                              PathA.push(PathB[y]);
                            }

                            setTimeout(() => {
                              SimulateGridSearch(PathA);
                              // SimulateGridSearch(PathB);
                            }, 1000);
                          }
                        }
                      }else{
                        SortEnqueueing(Enqueueing);

                        if (Enqueueing.length !== 0) {
                          let QueueToExtendNext = Enqueueing.shift();
                          ShiftedEnqueueings.push(QueueToExtendNext);
                          CalculateGridNodes(QueueToExtendNext, type);
                        }
                      }

                      clearInterval(reiterate);
                    }
                  }, 0);

                  clearInterval(reanimateframe);
                }
              }, SPEED * 300);
            } else {
              if (Enqueueing.length !== 0) {
                let QueueToExtendNext = Enqueueing.shift();
                ShiftedEnqueueings.push(QueueToExtendNext);
                CalculateGridNodes(QueueToExtendNext, type);
              }
            }
          }else{
            
            if (BidirectionalIndex.indexOf(NodeIndexMap) == -1) {
              BidirectionalIndex.push(NodeIndexMap);
              BidirectionalChildren.push(NodeIndexMap);
              if(!NodeToExtend.bi) NodeToExtend.bi = true;

              let Neighbours = NodeToExtend.getChildNodes();
              SortChildNodes(Neighbours);

              let position = 0;
              Neighbours[position].mark();

              const reanimateframe = setInterval(() => {
                if (position < Neighbours.length) {
                  let Node = Neighbours[position];

                  if (!Node.blocked) {
                    Node.testblock();

                    if (position < Neighbours.length - 1) {
                      Neighbours[position + 1].mark();
                    }
                  }

                  position++;
                } else {

                  let init = 0;
                  let Extensions = [];
                  let Travel = QueueToExtendArray[1];

                  const reiterate = setInterval(() => {
                    if (init < Neighbours.length) {
                      let Node = Neighbours[init];
                      Extensions[init] = QueueToExtend.slice();
                      Extensions[init].push(Node);

                      Bidirectional.push([
                        Extensions[init],
                        Travel + 1 + ManhattanDistance(Node, StartingNode),
                      ]);


                      let NodeMap = "" + Node.i + "," + Node.j;
                      BidirectionalChildren.push(NodeMap);
                      Node.bi = true;

                      init++;
                    } else {

                      let EdgeNode = undefined;

                      for (let i = 0; i < Neighbours.length && !SOLVED; i++) {
                        let Continue = true;
                        let Node = Neighbours[i];
                        let Children = Node.getChildNodes(true);

                        for (let j = 0; j < Children.length; j++) {
                          let Child = Children[j];
                          if (Child.tested && Child.en) {
                            // alert("found 1");
                            SOLVED = true;
                            Continue = false;
                            EdgeNode = Child;
                            QueueToExtend.push(Node);
                            QueueToExtend.push(EdgeNode);
                            break;
                          }
                        }

                        if (!Continue) break;
                      }

                      if(SOLVED){
                        if(EdgeNode !== undefined){
                          let NodeMap = "" + EdgeNode.i + "," + EdgeNode.j;
                          if(ExtendedNodesIndex.indexOf(NodeMap) == -1){
                            let PathA = [], PathB = [];
                            PathA = QueueToExtend.slice();

                            for(let x = 0; x < Enqueueing.length; x++){
                              let QueueArray = Enqueueing[x];
                              let QueueExtended = QueueArray[0];
                              let NodeExtended = QueueExtended[QueueExtended.length-1];
                              
                              if(isEqual(EdgeNode, NodeExtended)){
                                PathB = QueueExtended.slice();
                                break;
                              }
                            }

                            for (let y = PathA.length - 1; y >= 0; y--) {
                              PathB.push(PathA[y]);
                            }

                            setTimeout(() => {
                              SimulateGridSearch(PathB);
                              // SimulateGridSearch(PathB);
                            }, 1000);

                          }else{
                            let PathA = [], PathB = [];
                            PathA = QueueToExtend.slice();

                            for (let x = 0; x < ShiftedEnqueueings.length; x++) {
                              let QueueArray = ShiftedEnqueueings[x];
                              let QueueExtended = QueueArray[0];
                              let NodeExtended =
                                QueueExtended[QueueExtended.length - 1];

                              if (isEqual(EdgeNode, NodeExtended)) {
                                PathB = QueueExtended.slice();
                                break;
                              }
                            }

                            for (let y = PathA.length - 1; y >= 0; y--) {
                              PathB.push(PathA[y]);
                            }

                            setTimeout(() => {
                              SimulateGridSearch(PathB);
                              // SimulateGridSearch(PathB);
                            }, 1000);
                          }
                        }
                      }else{
                        SortEnqueueing(Bidirectional);

                        if (Bidirectional.length !== 0) {
                          let QueueToExtendNext = Bidirectional.shift();
                          ShiftedBidirections.push(QueueToExtendNext);
                          CalculateGridNodes(QueueToExtendNext, type);
                        }
                      }

                      clearInterval(reiterate);
                    }
                  }, 0);

                  clearInterval(reanimateframe);
                }
              }, SPEED * 300);
            } else {
              if (Bidirectional.length !== 0) {
                let QueueToExtendNext = Bidirectional.shift();
                ShiftedBidirections.push(QueueToExtendNext);
                CalculateGridNodes(QueueToExtendNext, type);
              }
            }
          }
        }
      }

      CalculateGridNodes(QueueToExtendFirst, true);
      CalculateGridNodes(BidirectionalQueue, false);
    }

    BidirectionalBtn[0].addEventListener("click", () => {
      CleverPath = [];
      if(addbomb) bombBtn.click();
      resetSearch();
      BidirectionalSwarm();
    });
}
