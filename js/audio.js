let song, fft;
let particles = [],
  img;

// Loading the Song
// var loader = document.querySelector(".loader");

function preload() {
  // song = loadSound("./audio/Go_away_Romantic_Dr.mp3");
  // song = loadSound("./audio/audio1.mp3");

  inputBtn = createFileInput((file) => {
    console.log("file", file);
    song = loadSound(file.data);
    console.log("sound", song);
    if (song) {
      console.log("something");
    }
    song.play();
  });
  inputBtn.position(5, 5);

  img = loadImage("./img/quantum_gradient.svg");
}

function mouseClicked() {
  if (song) {
    if (song.isPlaying()) {
      song.pause();
      noLoop();
    } else {
      song.play();
      loop();
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // fft = new p5.FFT()// fast fourier transform-> used to make animations
  fft = new p5.FFT(0.3); // optional smoothing value
  // if it's lower the alpha layer will fade out faster.

  imageMode(CENTER);
  // img.filter(BLUR, 12);
}
function draw() {
  // if (mouseButton === LEFT)
  {
    background(0); // black

    translate(width / 2, height / 2);

    fft.analyze();
    amp = fft.getEnergy(20, 200);

    let wave = fft.waveform();

    push();
    if (amp > 230) {
      rotate(random(-0.5, 0.5));
    }
    image(img, 0, 0, width, height);
    // image(img, 0, 0, width + 100, height + 100);
    pop();

    stroke(300);
    strokeWeight(3);
    noFill();
    /** 
		beginShape()
		//	*****************For LINEAR****************
		for (let i = 0; i < width; i++) {
			let index = floor(map(i, 0, width, 0, wave.length));
			let x = i;
			let y = wave[index] * 300 + height / 2;
			vertex(x, y);
		}
		endShape();
		*/

    for (let t = -1; t <= 1; t += 2) {
      /** t is either -1 or +1 hence we can cover both part of circles using that*/
      beginShape();
      for (let i = 0; i <= 180; i++) {
        let index = floor(map(i, 0, 180, 0, wave.length - 1));
        var r = map(wave[index], -1, 1, 150, 350); // average radius = (150+350)/2 = 250
        let x = r * sin(i) * t;
        let y = r * cos(i);
        vertex(x, y);
      }
      endShape();
    }

    let particle = new Particle();
    particles.push(particle);

    for (let i = particles.length - 1; i >= 0; i--) {
      if (!particles[i].edges()) {
        particles[i].updatePos(amp > 230);
        particles[i].show();
      } else {
        particles.splice(i, 1);
      }
    }
  }
}

class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250);

    this.velocity = createVector(0, 0);
    this.accleration = this.pos.copy().mult(random(0.0001, 0.00001)); // accleration

    this.width = random(3, 5); // width of the particle

    this.colorArr = [random(200, 255), random(200, 255), random(200, 255)];
  }
  show() {
    noStroke();
    fill(this.colorArr);
    ellipse(this.pos.x, this.pos.y, this.width);
  }

  updatePos(condition) {
    this.velocity.add(this.accleration);
    this.pos.add(this.velocity);

    if (condition) {
      this.pos.add(this.velocity);
      this.pos.add(this.velocity);
      this.pos.add(this.velocity);
    }
  }

  edges() {
    let x = this.pos.x;
    let y = this.pos.y;
    if (x < -width / 2 || x > width / 2 || y < -height / 2 || y > height / 2)
      return true;
    else return false;
  }
}
