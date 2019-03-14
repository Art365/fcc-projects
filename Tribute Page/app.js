window.onload = function() {
  "use strict";


  const BG_COLOR = "black",
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
      starCount,
      minStarRadius,
      maxStarRadius,
      maxDistance = 8000,
      speed = 1, 
      stars, 
      render = 0;

  const init = function() {
    ctx = canvas.getContext("2d", { alpha: false });
    offCtx = offCanvas.getContext("2d", { alpha: false });
    canvasWidth = canvas.width = offCanvas.width = porthole.offsetWidth;
    canvasHeight = canvas.height = offCanvas.height = porthole.offsetHeight;
    canvasCenter = { x: canvasWidth / 2, y: canvasHeight / 2};
    minStarRadius = 0.5;
    maxStarRadius = minStarRadius * 4;
    starCount = (canvasWidth + canvasHeight) / 2;
  };
      
  init();
  
  const imagesOfCarl = [
    [
      "assets/images/sagan_in_front_of_planets.jpg 600w, assets/images/sagan_in_front_of_planets--large.jpg 1200w", 
      "Carl Sagan standing in front of planets.", 
      `<p><cite>NASA JPL.</cite></p>
      <br>
      <p>Carl Sagan standing in front of planets.</p>`
    ],
    [
      "assets/images/planetary_society.jpg 976w, assets/images/planetary_society--large.jpg 1952w", 
      "Planetary Society.", 
      `<p><cite>NASA JPL. <i>Planetary Society.</i> , 1970s. Photograph.</cite></p>
      <br>
      <p>Carl Sagan, Bruce Murray (seated right to left) and (standing) Louis Friedman (standing, right), 
      the founders of The Planetary Society at the time of signing the papers formally incorporating the organization. 
      The fourth person is Harry Ashmore(standing, left), an advisor, who greatly helped in the founding of the Society.</span></p>`
    ],
    [
      "assets/images/sagan_with_planets.jpg 572w, assets/images/sagan_with_planets--large.jpg 1144w", 
      "Carl Sagan on the set of Cosmos.", 
      `<p><cite>Castaneda, Eduardo. <i>Carl Sagan with the planets.</i> , 1981. Photograph. https://www.loc.gov/item/cosmos000104/.</cite></p>
      <br>
      <p>Carl Sagan on the set of the television program Cosmos: A personal journey, standing among scale models of several 
      planets in the solar system.</p>`
    ],
    ["assets/images/carl_pioneer.jpg 640w, assets/images/carl_pioneer--large.jpg 1280w", 
    "Carl Sagan holding one of the Pioneer plaques.", 
    `<p><cite>Sagan, Carl. "A Message from Earth." Science Magazine, February 25, 1972.</cite></p>
    <br>
    <p>Carl Sagan holding one of the Pioneer plaques he helped design. The plaques were 
    meant to communicate information about the origin of the spacecraft to potential intelligent extrasterrestrial interceptor.
    The two plaques were placed on board the 1972 Pioneer 10 and 1973 Pioneer 11 spacecraft.</p>`
  ],
  ];
  

  // add event listener for resize
  window.addEventListener("resize", resizeCanvas, false);

  // add a sentinel value that turns off canvas drawing when images are being shown
  let count = 0;
  const image = document.getElementById("image");
  const imageClassList = image.classList;
  const imageCaption = document.getElementById("img-caption");
  const imageCaptionClassList = imageCaption.classList;



  // replace innerHTML with content replacemenet. that way, browser doesnt have to re-render new elemenets.
  setInterval(() => {
    render = 1;
    imageClassList.add("fade-out");
    imageCaptionClassList.add("slide-off");
    count = (count + 1) % imagesOfCarl.length;
    setTimeout(() => {
      image.setAttribute("srcset", imagesOfCarl[count][0]);
      image.setAttribute("alt", imagesOfCarl[count][1]);
      // imageCaption.innerHTML = imagesOfCarl[count][2];       // replace this! instead replace content.
      imageClassList.remove("fade-out");
      imageCaptionClassList.remove("slide-off");
      setTimeout(() => render = 0, 1000);
    }, 1000);
  }, 8000);

  // image.addEventListener("click", function(e) {
  //   let imageClassList = e.target.classList;
  //   imageClassList.toggle("fade-out");
  //   count = (count + 1) % imagesOfCarl.length;
  //   setTimeout(function() {
  //     e.target.setAttribute("srcset", imagesOfCarl[count][0]);
  //     e.target.setAttribute("alt", imagesOfCarl[count][1]);
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
    init();
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