window.onload = function() {
  "use strict";
  const BG_COLOR = "black",
        STAR_COUNT = 1000,
        round = (x) => Math.round(x),
        randomInt = (x) => Math.round(Math.random() * x),
        randomInRange = (min, max) => min + Math.random() * (max - min);
  let porthole = document.getElementById("porthole"),
      canvas = document.getElementById("c"),
      offCanvas = document.createElement("canvas"),
      ctx,
      offCtx,
      canvasWidth,
      canvasHeight,
      canvasCenter,
      minStarRadius,
      maxStarRadius,
      minDistance,
      maxDistance,
      speed;

  const init = function() {
    ctx = canvas.getContext("2d", { alpha: false });
    offCtx = offCanvas.getContext("2d", { alpha: false });
    canvasWidth = canvas.width = offCanvas.width = porthole.offsetWidth;
    canvasHeight = canvas.height = offCanvas.height = porthole.offsetHeight;
    canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2};
    minStarRadius = 1;
    maxStarRadius = minStarRadius * 40;
    // minDistance = 1;
    maxDistance = Math.max(canvasWidth, canvasHeight);
    speed = 1;
  };
      
  init();
  
  window.addEventListener("resize", resizeCanvas, false);


  class Star {
	  constructor(x, y, r, distance, color) {
	    this.x = x;
      this.y = y;
      this.r = r;
      this.distance = distance;
      this.color = color;
	  }
	
	  draw(context) {
      context.beginPath();
      context.moveTo(this.x, this.y);
      context.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
      context.fillStyle = this.color;
      context.fill();
    }
	
	  update() {
	    this.r += (this.r / this.distance);
      this.distance -= speed;

      if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight || this.distance < 0) {
        this.x = randomInt(canvasWidth);
        this.y = randomInt(canvasHeight);
        this.r = 1;
        this.distance = randomInt(maxDistance);
      } else {
        this.x += (this.x - canvasCenter.x) / this.distance;
        this.y += (this.y - canvasCenter.y) / this.distance;
      }
	  }
	
  }
  

  //initialize some stars
  // function createStars(num) {
  //   let starsArr = [];
  //   for (let i = 0; i < num; i++) {
  //     let [x, y] = [randomInt(canvasWidth), randomInt(canvasHeight)];
  //     let radius = randomInRange(minStarRadius, maxStarRadius);
  //     let distance = randomInRange(minDistance, maxDistance);
  //     let [red, green, blue] = [randomInRange(198,255), randomInRange(198,255), randomInRange(198,255)];
  //     green = Math.min(red, green, blue);
  //     let color = `rgba(${red},${green},${blue})`;
  //     starsArr[i] = new Star(x, y, radius, distance, color);
  //   }
  //   return starsArr;
  // }


  // REWORK THIS SO THAT MINSTARRADIUS IS 1 AND MAX IS LIKE 30. REMOVE AR VARIABLE, AND JUST INCREASE RADIUS WITH UPDATE.

  function createStars(num) {
    let starsArr = [];
    for (let i = 0; i < num; i++) {
      let [x, y] = [randomInt(canvasWidth), randomInt(canvasHeight)];
      let radius = randomInt(maxStarRadius);
      let distance = randomInt(maxDistance);
      let [red, green, blue] = [randomInRange(198,255), randomInRange(198,255), randomInRange(198,255)];
      green = Math.min(red, green, blue);
      let color = `rgba(${red},${green},${blue})`;
      starsArr[i] = new Star(x, y, radius, distance, color);
    }
    return starsArr;
  }
  
  
  let stars = createStars(STAR_COUNT);

  function resizeCanvas() {
    init();
    stars = createStars(STAR_COUNT);
  }
  

  function animate() {
    offCtx.fillStyle = BG_COLOR;
    offCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0, len = stars.length; i < len; i++) {
      stars[i].draw(offCtx);
      stars[i].update();
    }
    
    ctx.save();
    ctx.drawImage(offCanvas, 0, 0);
    ctx.restore();
    
    window.requestAnimationFrame(animate);
  }

  animate();

}