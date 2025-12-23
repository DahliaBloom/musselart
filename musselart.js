/**
 * MusselArt.js
 * Using Instance Mode for better reliability
 */

new p5((p) => {
  let font;
  let mussels = [];
  let heartPoints = [];
  const config = {
    name: 'Hey',
    fontSize: 200,
    pointDensity: 0.15,
    background: '#000814',
    palette: [
      '#001d3d', // Darkest Navy
      '#003566', // Deep Blue
      '#0077b6', // Ocean Blue
      '#00b4d8', // Sky Blue
      '#90e0ef', // Light Cyan
      '#caf0f8', // Crystal White
      '#ffd6ff', // Hint of Pink Glow
      '#bde0fe'  // Soft Pastel Blue
    ],
    friction: 0.84,
    springStrength: 1,
    letterSpacing: 1.8 // Slightly more space for elegance
  };

  p.preload = () => {
    font = p.loadFont('Roboto.ttf');
  };

  class Mussel {
    constructor(x, y, size) {
      this.origin = p.createVector(x, y);
      this.pos = p.createVector(x, y); // Start at origin to remove initial spring animation
      this.vel = p.createVector(0, 0);
      this.acc = p.createVector(0, 0);
      this.size = size * p.random(0.8, 1.8);
      this.angleOffset = p.random(p.TWO_PI);
      this.color = p.color(p.random(config.palette));
      this.noiseOffset = p.random(1000);
      this.lifeOffset = p.random(1000);
    }

    update() {
      // Global dynamic movement: The whole name sways as one unit
      let globalTime = p.frameCount * 0.015;
      let globalX = p.sin(globalTime) * 15; // Sway left/right
      let globalY = p.cos(globalTime * 0.8) * 10; // Bob up/down
      
      // Coordinated wave motion passing through the letters
      let waveY = p.sin(globalTime * 1.5 + this.origin.x * 0.005) * 6;

      // New dynamic target position (Origin + Global Movement + Local Wave)
      let targetX = this.origin.x + globalX;
      let targetY = this.origin.y + globalY + waveY;

      // Spring back to the moving target
      let force = p.createVector(targetX - this.pos.x, targetY - this.pos.y);
      let distToTarget = force.mag();
      if (distToTarget > 0) {
        force.normalize();
        force.mult(distToTarget * config.springStrength);
        this.acc.add(force);
      }

      // Individual organic micro-life (very subtle)
      let floatX = p.sin(p.frameCount * 0.03 + this.noiseOffset) * 0.4;
      let floatY = p.cos(p.frameCount * 0.04 + this.noiseOffset) * 0.4;
      this.acc.add(p.createVector(floatX, floatY));

      this.vel.add(this.acc);
      this.vel.mult(config.friction);
      this.pos.add(this.vel);
      this.acc.mult(0);
    }

    display() {
      p.push();
      p.translate(this.pos.x, this.pos.y);
      let breathing = p.sin(p.frameCount * 0.02 + this.lifeOffset) * 0.15;
      p.rotate(this.angleOffset + breathing);
      
      p.noFill();
      let alpha = p.map(p.sin(p.frameCount * 0.01 + this.lifeOffset), -1, 1, 150, 255);
      
      // Multi-layered stroke for "glow" effect
      p.stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha * 0.3);
      p.strokeWeight(1.5);
      this.drawShell(p, 4); // Outer soft glow

      p.stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], alpha);
      p.strokeWeight(0.7);
      this.drawShell(p, 4); // Main shell
      
      // Core highlight
      p.noStroke();
      p.fill(255, 255, 255, alpha * 0.8);
      p.ellipse(0, 0, 1.2, 1.2);
      p.pop();
    }

    drawShell(p, maxThetaMult) {
      p.beginShape();
      let a = 0.2;
      let b = 0.12;
      let maxTheta = p.PI * maxThetaMult;
      for (let theta = 0; theta < maxTheta; theta += 0.25) {
        let r = a * p.exp(b * theta) * this.size;
        // Reduced horizontal elongation (from 2.2 to 1.8) to keep letters distinct
        let x = r * p.cos(theta) * 1.8; 
        let y = r * p.sin(theta) * 0.9; 
        p.vertex(x, y);
        
        if (theta > p.PI && theta % 0.8 < 0.2) {
          p.push();
          p.strokeWeight(0.2);
          p.line(x, y, x * 1.1, y * 1.1);
          p.pop();
        }
      }
      p.endShape();
    }
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.pixelDensity(p.displayDensity());
    initializeSketch();
  };

  const initializeSketch = () => {
    mussels = [];
    heartPoints = [];
    
    // Read name from URL parameter 'name'
    let urlParams = new URLSearchParams(window.location.search);
    let displayName = urlParams.get('name') || config.name;
    
    const isMobile = p.width < 600 || p.height > p.width;
    
    // Mobile-first sizing
    let padding = p.width * (isMobile ? 0.08 : 0.1);
    let availableWidth = p.width - padding * 2;
    
    // Mobile-first spacing: Standard tight spacing for most letters
    let dynamicSpacing = 1.35; 
    
    // Dynamically adjust font size to fit width
    // We calculate a base size and then scale it if it exceeds available width
    let baseFontSize = isMobile ? p.constrain(availableWidth * 0.2, 40, 120) : p.constrain(availableWidth * 0.14, 80, 240);
    
    // Calculate total width with base font size
    let tempX = 0;
    for (let char of displayName.split('')) {
      let b = font.textBounds(char, 0, 0, baseFontSize);
      let charLower = char.toLowerCase();
      // Special spacing for narrowest letters only
      let isNarrow = charLower === 'i' || charLower === 'l';
      let extraSpace = isNarrow ? 1.8 : (charLower === 'y' ? 1.3 : dynamicSpacing);
      let advancement = b.w * extraSpace;
      
      // Minimum advancement for narrowest clarity
      if (isNarrow) {
        advancement = Math.max(advancement, baseFontSize * 0.35);
      }
      
      tempX += advancement;
    }
    
    // If total width is too large, scale down the font size
    if (tempX > availableWidth) {
      config.fontSize = baseFontSize * (availableWidth / tempX);
    } else {
      config.fontSize = baseFontSize;
    }
    
    // Generate points letter by letter
    let chars = displayName.split('');
    let currentX = 0;
    let allPoints = [];
    
    for (let char of chars) {
      let dynamicDensity = isMobile ? 0.22 : 0.2;
      let charPoints = font.textToPoints(char, currentX, 0, config.fontSize, {
        sampleFactor: dynamicDensity
      });
      allPoints.push(...charPoints);
      
      let bounds = font.textBounds(char, 0, 0, config.fontSize);
      let charLower = char.toLowerCase();
      
      // Apply the same special spacing for actual rendering
      let isNarrow = charLower === 'i' || charLower === 'l';
      let extraSpace = isNarrow ? 2 : (charLower === 'y' ? 1.5 : dynamicSpacing);
      let advancement = bounds.w * extraSpace;
      
      if (isNarrow) {
        advancement = Math.max(advancement, config.fontSize * 0.35);
      }
      
      currentX += advancement;
    }
    
    // Centering calculations
    let minX = Math.min(...allPoints.map(pt => pt.x));
    let maxX = Math.max(...allPoints.map(pt => pt.x));
    let minY = Math.min(...allPoints.map(pt => pt.y));
    let maxY = Math.max(...allPoints.map(pt => pt.y));
    
    let centerX = (maxX - minX) / 2;
    let centerY = (maxY - minY) / 2;
    
    let offsetX = p.width / 2 - centerX - minX;
    let offsetY = p.height / 2 + centerY / 2;
    
    // Stretch factor: Mobile-first taller letters
    let stretchFactor = isMobile ? 2.2 : 1.8;
    
    for (let pt of allPoints) {
      let stretchedY = pt.y * stretchFactor; 
      
      // Spiral size: Mobile-first smaller/crisper
      let dynamicMusselSize;
      if (isMobile) {
        dynamicMusselSize = p.constrain(p.width * 0.005, 1.8, 2.8);
      } else {
        dynamicMusselSize = p.constrain(p.width * 0.002, 1.5, 3.5);
      }
      
      mussels.push(new Mussel(pt.x + offsetX, stretchedY + offsetY, dynamicMusselSize));
    }

    // Heart scale: Mobile-first centering
    let heartScale = isMobile ? 
      p.constrain(availableWidth * 0.06, 15, 35) : 
      p.constrain(availableWidth * 0.04, 20, 30);
      
    for (let t = 0; t < p.TWO_PI; t += 0.05) {
      let x = 16 * p.pow(p.sin(t), 3);
      let y = -(13 * p.cos(t) - 5 * p.cos(2 * t) - 2 * p.cos(3 * t) - p.cos(4 * t));
      heartPoints.push(p.createVector(x * heartScale + p.width / 2, y * heartScale + p.height / 2));
    }
  };

  p.draw = () => {
    p.background(config.background);

    // Draw the background heart with enhanced glow
    p.push();
    p.noFill();
    
    // Outer most soft aura
    p.stroke(0, 40, 100, 15);
    p.strokeWeight(40);
    p.beginShape();
    for (let v of heartPoints) {
      let n = p.noise(v.x * 0.01, v.y * 0.01, p.frameCount * 0.005) * 15;
      p.vertex(v.x + n, v.y + n);
    }
    p.endShape(p.CLOSE);

    // Medium glow
    p.stroke(0, 60, 120, 25);
    p.strokeWeight(15);
    p.beginShape();
    for (let v of heartPoints) {
      let n = p.noise(v.x * 0.01, v.y * 0.01, p.frameCount * 0.008) * 10;
      p.vertex(v.x + n, v.y + n);
    }
    p.endShape(p.CLOSE);

    // Core heart line
    p.stroke(0, 80, 180, 50); 
    p.strokeWeight(2);
    p.beginShape();
    for (let v of heartPoints) {
      let n = p.noise(v.x * 0.01, v.y * 0.01, p.frameCount * 0.01) * 5;
      p.vertex(v.x + n, v.y + n);
    }
    p.endShape(p.CLOSE);
    p.pop();

    p.blendMode(p.SCREEN);
    for (let m of mussels) {
      m.update();
      m.display();
    }
    p.blendMode(p.BLEND);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initializeSketch(); // Re-calculate points and scales on resize
  };
});
