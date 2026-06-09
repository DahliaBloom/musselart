/**
 * MusselArt.js
 * Using Instance Mode for better reliability
 */

new p5((p) => {
  let font;
  let heartPoints = [];
  let sparkles = [];
  let displayName;
  const config = {
    name: 'Hey',
    fontSize: 200,
    background: '#000814'
  };

  p.preload = () => {
    font = p.loadFont('Parisienne-Regular.ttf');
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.pixelDensity(p.displayDensity());
    initializeSketch();
  };

  const initializeSketch = () => {
    heartPoints = [];

    let urlParams = new URLSearchParams(window.location.search);
    displayName = urlParams.get('name') || config.name;

    const isMobile = p.width < 600 || p.height > p.width;

    let padding = p.width * (isMobile ? 0.08 : 0.1);
    let availableWidth = p.width - padding * 2;

    let baseFontSize = isMobile
      ? p.constrain(availableWidth * 0.35, 80, 200)
      : p.constrain(availableWidth * 0.2, 120, 320);

    let bounds = font.textBounds(displayName, 0, 0, baseFontSize);
    config.fontSize = bounds.w > availableWidth
      ? baseFontSize * (availableWidth / bounds.w)
      : baseFontSize;

    let heartScale = isMobile ?
      p.constrain(availableWidth * 0.06, 15, 35) :
      p.constrain(availableWidth * 0.04, 20, 30);

    for (let t = 0; t < p.TWO_PI; t += 0.05) {
      let x = 16 * p.pow(p.sin(t), 3);
      let y = -(13 * p.cos(t) - 5 * p.cos(2 * t) - 2 * p.cos(3 * t) - p.cos(4 * t));
      heartPoints.push(p.createVector(x * heartScale + p.width / 2, y * heartScale + p.height / 2));
    }

    sparkles = [];
    let bounds2 = font.textBounds(displayName, 0, 0, config.fontSize);
    let textCX = p.width / 2;
    let textCY = p.height / 2;
    let spreadX = bounds2.w * 0.7;
    let spreadY = config.fontSize * 0.8;
    let numSparkles = isMobile ? 18 : 30;

    for (let i = 0; i < numSparkles; i++) {
      let angle = p.random(p.TWO_PI);
      let radius = p.random(0.4, 1.0);
      sparkles.push({
        x: textCX + p.cos(angle) * spreadX * radius,
        y: textCY + p.sin(angle) * spreadY * radius,
        phase: p.random(p.TWO_PI),
        speed: p.random(0.015, 0.04),
        size: p.random(1.5, 4.5),
        colorSeed: p.random(1)
      });
    }
  };

  p.draw = () => {
    p.background(config.background);

    // Draw the background heart with "Mirror Mirror" 3D depth effect and enhanced halo
    p.push();
    p.noFill();
    
    // Add a wide atmospheric halo behind the whole heart (slightly lighter)
    p.stroke(10, 70, 180, 12);
    p.strokeWeight(100);
    p.beginShape();
    for (let v of heartPoints) {
      p.vertex(v.x, v.y);
    }
    p.endShape(p.CLOSE);

    let numLayers = 15;
    for (let i = 0; i < numLayers; i++) {
      let layerRatio = i / numLayers;
      // Recede inwards: scale down and fade out
      let scale = 1 - layerRatio * 0.6;
      let alpha = p.map(i, 0, numLayers, 60, 10); // Slightly more opaque inwards
      let weight = p.map(i, 0, numLayers, 3, 0.8);
      
      // INWARDS COLOR EFFECT: Base blue gradient
      let baseR = p.lerp(0, 30, layerRatio);
      let baseG = p.lerp(80, 160, layerRatio);
      let baseB = p.lerp(180, 255, layerRatio);
      
      // ANIMATED PURPLE PULSE: Flows inwards
      // Using a sine wave based on frameCount and layer index
      let pulseSpeed = 0.04;
      let pulseFreq = 0.4;
      let pulse = p.sin(p.frameCount * pulseSpeed - i * pulseFreq);
      let purpleStrength = p.max(0, pulse); // Only use the positive part of the wave
      
      // Blend base blue with a radiant purple
      let r = p.lerp(baseR, 140, purpleStrength * 0.7);
      let g = p.lerp(baseG, 20, purpleStrength * 0.7);
      let b = p.lerp(baseB, 255, purpleStrength * 0.7);
      
      p.stroke(r, g, b, alpha + (purpleStrength * 20)); // Purple is slightly more luminous
      p.strokeWeight(weight + (purpleStrength * 0.5));
      
      p.beginShape();
      for (let v of heartPoints) {
        // Calculate point relative to center for scaling
        let relX = v.x - p.width / 2;
        let relY = v.y - p.height / 2;
        
        // Add subtle 3D parallax/shimmer
        let depthShift = p.sin(p.frameCount * 0.01 + i * 0.2) * 5 * layerRatio;
        let n = p.noise(v.x * 0.01, v.y * 0.01, p.frameCount * 0.005 + i * 0.1) * 10;
        
        p.vertex(
          p.width / 2 + relX * scale + depthShift, 
          p.height / 2 + relY * scale + depthShift + n
        );
      }
      p.endShape(p.CLOSE);
      
      // Enhanced glow layers for the first few rings (slightly lighter)
      if (i < 5) {
        p.strokeWeight(weight * 12);
        p.stroke(r, g + 20, b, alpha * 0.3); // Slightly lighter glow
        p.beginShape();
        for (let v of heartPoints) {
          let relX = v.x - p.width / 2;
          let relY = v.y - p.height / 2;
          p.vertex(p.width / 2 + relX * scale, p.height / 2 + relY * scale);
        }
        p.endShape(p.CLOSE);
      }
    }
    p.pop();

    // Render text with animated color matching heart's blue-to-purple pulse
    p.blendMode(p.SCREEN);
    p.push();
    p.textFont(font);
    p.textSize(config.fontSize);
    p.textAlign(p.CENTER, p.CENTER);

    let glowLayers = 6;
    for (let i = 0; i < glowLayers; i++) {
      let layerRatio = i / glowLayers;

      let tBaseR = p.lerp(0, 30, layerRatio);
      let tBaseG = p.lerp(80, 160, layerRatio);
      let tBaseB = p.lerp(180, 255, layerRatio);

      let pulse = p.sin(p.frameCount * 0.04 - i * 0.4);
      let purpleStrength = p.max(0, pulse);

      let r = p.lerp(tBaseR, 140, purpleStrength * 0.7);
      let g = p.lerp(tBaseG, 20, purpleStrength * 0.7);
      let b = p.lerp(tBaseB, 255, purpleStrength * 0.7);

      if (i < glowLayers - 1) {
        let strokeW = p.map(i, 0, glowLayers - 1, 22, 2);
        let a = p.map(i, 0, glowLayers - 1, 6, 55) + purpleStrength * 10;
        p.noFill();
        p.stroke(r, g, b, a);
        p.strokeWeight(strokeW);
        p.text(displayName, p.width / 2, p.height / 2);
      } else {
        p.noStroke();
        p.fill(r, g, b, 130 + purpleStrength * 20);
        p.text(displayName, p.width / 2, p.height / 2);
      }
    }

    p.noStroke();
    p.fill(200, 220, 255, 30);
    p.text(displayName, p.width / 2, p.height / 2);

    p.pop();

    for (let s of sparkles) {
      let twinkle = p.sin(p.frameCount * s.speed + s.phase);
      let brightness = p.max(0, twinkle);
      if (brightness < 0.05) continue;

      let pulse = p.sin(p.frameCount * 0.04 + s.colorSeed * p.TWO_PI);
      let purple = p.max(0, pulse);

      let r = p.lerp(30, 140, purple * 0.7);
      let g = p.lerp(140, 20, purple * 0.7);
      let b = p.lerp(240, 255, purple * 0.7);
      let a = brightness * 180;

      let sz = s.size * (0.5 + brightness * 0.5);

      p.push();
      p.translate(s.x, s.y);
      p.noFill();
      p.stroke(r, g, b, a);
      p.strokeWeight(1.2);
      p.line(-sz, 0, sz, 0);
      p.line(0, -sz, 0, sz);
      let d = sz * 0.55;
      p.strokeWeight(0.6);
      p.line(-d, -d, d, d);
      p.line(-d, d, d, -d);

      p.noStroke();
      p.fill(200, 220, 255, a * 0.7);
      p.ellipse(0, 0, sz * 0.5, sz * 0.5);
      p.pop();
    }

    p.blendMode(p.BLEND);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    initializeSketch();
  };
});
