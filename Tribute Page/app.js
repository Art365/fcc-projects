window.onload = function() {
  "use strict";

  const BG_COLOR = "black",
        randomInt = (x) => Math.round(Math.random() * x),
        randomInRange = (min, max) => min + Math.random() * (max - min);
  let hero = document.getElementById("hero"),
      canvas = document.getElementById("c"),
      offCanvas = document.createElement("canvas"),
      ctx,
      offCtx,
      canvasWidth,
      canvasHeight,
      canvasCenter,
      starCount,
      minStarRadius,
      maxStarRadius,
      maxDistance = 8000,
      speed = 1, 
      stars, 
      render = 0;

  const initCanvas = function() {
    ctx = canvas.getContext("2d", { alpha: false });
    offCtx = offCanvas.getContext("2d", { alpha: false });
    canvasWidth = canvas.width = offCanvas.width = hero.offsetWidth;
    canvasHeight = canvas.height = offCanvas.height = hero.offsetHeight;
    canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2};
    minStarRadius = 0.5;
    maxStarRadius = minStarRadius * 4;
    starCount = (canvasWidth + canvasHeight) / 2;
  };
      
  initCanvas();
  





function updateHero() {

  render = 1;
  updateHero.index = updateHero.index || 0;
  const images = document.getElementsByClassName("hero__image");
  const imageCaption = document.getElementById("img-caption");
  const citation = document.getElementById("hero-citation");
  const description = document.getElementById("hero-description");
  const imageCaptions = [
    {
      citation: "NASA JPL.",
      description: "Carl Sagan standing in front of planets."
    },
    {
      citation: "NASA JPL. Planetary Society. , 1970s. Photograph.",
      description: "Carl Sagan, Bruce Murray (seated right to left) and (standing) Louis Friedman (standing, right), the founders of The Planetary Society at the time of signing the papers formally incorporating the organization. The fourth person is Harry Ashmore(standing, left), an advisor, who greatly helped in the founding of the Society."
    },
    {
      citation: "Castaneda, Eduardo. Carl Sagan with the planets. , 1981. Photograph. https://www.loc.gov/item/cosmos000104/.",
      description: "Carl Sagan on the set of the television program Cosmos: A personal journey, standing among scale models of several planets in the solar system."
    },
    {
      citation: "Sagan, Carl. \"A Message from Earth.\" Science Magazine, February 25, 1972.",
      description: "Carl Sagan holding one of the Pioneer plaques he helped design. The plaques were meant to communicate information about the origin of the spacecraft to potential intelligent extrasterrestrial interceptor. The two plaques were placed on board the 1972 Pioneer 10 and 1973 Pioneer 11 spacecraft."
    },
  ];

  images[updateHero.index].classList.remove("hero__image--current");
  imageCaption.classList.remove("slide-out");
  updateHero.index = (updateHero.index + 1) % imageCaptions.length;

  const showNext = () => {
    citation.textContent = imageCaptions[updateHero.index].citation; 
    description.textContent = imageCaptions[updateHero.index].description;
    images[updateHero.index].classList.add("hero__image--current");
    imageCaption.classList.add("slide-out");
    setTimeout(() => render = 0, 1000);
  }

  setTimeout(showNext, 1000);

  // return index;
}



  // add event listener for resize
  window.addEventListener("resize", resizeCanvas, false);

  
  setInterval(updateHero, 18000);

  // image.addEventListener("click", function(e) {
  //   let imageClassList = e.target.classList;
  //   imageClassList.toggle("fade-out");
  //   count = (count + 1) % imageCaptions.length;
  //   setTimeout(function() {
  //     e.target.setAttribute("srcset", imageCaptions[count][0]);
  //     e.target.setAttribute("alt", imageCaptions[count][1]);
  //     imageClassList.toggle("fade-out");
  //   }, 800);
  // }, false);

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
	    this.r += this.r / this.distance;
      this.distance -= speed;

      if (this.x + this.r < 0 || this.x - this.r > canvasWidth || this.y + this.r < 0 || this.y - this.r > canvasHeight || this.distance < 0) {
        this.x = randomInt(canvasWidth);
        this.y = randomInt(canvasHeight);
        this.r = minStarRadius;
        this.distance = randomInt(maxDistance);
      } else {
        this.x += (this.x - canvasCenter.x) / this.distance;
        this.y += (this.y - canvasCenter.y) / this.distance;
      }
	  }
	
  }

  function createStars(num) {
    let starsArr = [];
    for (let i = 0; i < num; i++) {
      let [x, y] = [randomInt(canvasWidth), randomInt(canvasHeight)];
      let radius = randomInRange(minStarRadius, maxStarRadius);
      let distance = randomInt(maxDistance);
      let [red, green, blue] = [randomInRange(198,255), randomInRange(198,255), randomInRange(198,255)];
      green = Math.min(red, green, blue);
      let color = `rgba(${red},${green},${blue})`;
      starsArr[i] = new Star(x, y, radius, distance, color);
    }
    return starsArr;
  }
  
  
  stars = createStars(starCount);

  function resizeCanvas() {
    initCanvas();
    stars = createStars(starCount);
  }
  

  function animate() {

    if (render) {
      offCtx.fillStyle = BG_COLOR;
      offCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    for (let i = 0, len = stars.length; i < len; i++) {
      stars[i].draw(offCtx);
      stars[i].update();
    }
    
    if (render) {
      ctx.save();
      ctx.drawImage(offCanvas, 0, 0);
      ctx.restore();
    }
    
    window.requestAnimationFrame(animate);
  }

  animate();

}