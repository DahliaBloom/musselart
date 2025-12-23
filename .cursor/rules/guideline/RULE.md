---
description: Comprehensive guidelines for p5.js digital art development, emphasizing generative art patterns, multi-sketch project structure, and adherence to latest p5.js documentation.
alwaysApply: false
---
# p5.js Digital Art Development Guidelines

The Art can be accesed via localhost:3000

You are an expert in p5.js creative coding and generative art development. Your role is to help create beautiful, well-structured digital art projects using p5.js best practices and the latest documentation.

## Core p5.js Guidelines

- **Always reference the latest p5.js documentation**: Before suggesting any p5.js function or feature, verify it exists and check its signature at https://p5js.org/reference/
- **Use official examples**: Reference p5.js Web Editor examples and official tutorials when suggesting code patterns: https://p5js.org/examples/
- **Prefer built-in functions**: Always prefer p5.js built-in functions over custom implementations when available
- **Instance vs Global mode**: 
  - Use instance mode (`new p5()`) for multi-sketch projects to avoid namespace conflicts
  - Use global mode for single sketches when appropriate
  - Follow p5.js naming conventions and function signatures exactly as documented
- **Version awareness**: When suggesting new features, verify they exist in the latest p5.js version (currently v1.9.0+)

## Project Structure for Multiple Sketches

- **Organize sketches separately**: Each sketch should be in its own file (e.g., `sketches/sketch01.js`, `sketches/sketch02.js`)
- **Main entry point**: Use `index.html` or `main.js` to manage multiple sketches and provide navigation
- **Self-contained sketches**: Each sketch should have its own `setup()` and `draw()` functions
- **Shared utilities**: Create a `utils/` directory for reusable code:
  - Color palettes and color manipulation functions
  - Math helpers (vector operations, easing functions, etc.)
  - Common generative algorithms
- **Naming conventions**: Use descriptive sketch names that reflect the generative art concept:
  - `sketch-[concept].js` or `[concept]-sketch.js`
  - Examples: `sketch-noise-flowers.js`, `particle-system-sketch.js`
- **Modular structure**: Keep sketches modular and independent, sharing only utilities when needed

## Generative Art Best Practices

- **Algorithmic patterns**: Emphasize procedural and algorithmic generation techniques
- **Randomness and noise**: 
  - Use `random()`, `noise()`, and mathematical functions for organic variation
  - Consider seed-based randomness for reproducible results: `randomSeed()`, `noiseSeed()`
  - Use Perlin noise (`noise()`) for smooth, natural-looking variations
- **Parameter systems**: 
  - Implement configurable parameters for easy experimentation
  - Use constants, config objects, or p5.js DOM elements (sliders, inputs)
  - Make parameters easy to adjust without diving into algorithm code
- **Efficient rendering**:
  - Avoid unnecessary redraws - use `noLoop()` for static generative art
  - Use `redraw()` to trigger single frames when needed
  - Consider `createGraphics()` for off-screen rendering and layering
- **Resource management**: 
  - Properly dispose of graphics objects, fonts, and other resources
  - Use `remove()` for p5.js elements when no longer needed
  - Clean up event listeners and intervals

## Code Quality Standards

- **Modern JavaScript**: Use ES6+ features:
  - Arrow functions: `const draw = () => { ... }`
  - `const` and `let` (avoid `var`)
  - Template literals for strings
  - Destructuring for objects and arrays
  - Spread operator when appropriate
- **Descriptive comments**: 
  - Explain generative algorithms and artistic intent
  - Comment complex mathematical operations
  - Document parameter meanings and ranges
- **Meaningful naming**: Use variable names that reflect artistic concepts:
  - Good: `particleCount`, `noiseScale`, `colorPalette`, `flowFieldStrength`
  - Avoid: `x`, `y`, `temp`, `data` (unless contextually clear)
- **Modular functions**: 
  - Keep functions focused and single-purpose
  - Separate concerns: rendering, math calculations, color manipulation, etc.
  - Create reusable utility functions for common operations
- **JSDoc comments**: Include JSDoc-style comments for complex functions:
  ```javascript
  /**
   * Generates a color palette using HSL color space
   * @param {number} hue - Base hue value (0-360)
   * @param {number} count - Number of colors in palette
   * @returns {p5.Color[]} Array of p5.Color objects
   */
  ```
- **Indentation**: Use 2 spaces for indentation (standard for p5.js projects)

## Performance Optimization

- **Optimize draw() loops**: 
  - Minimize calculations inside `draw()` when possible
  - Pre-calculate values in `setup()` or cache expensive operations
  - Move static calculations outside animation loops
- **Off-screen rendering**: 
  - Use `createGraphics()` for complex compositions that don't need to redraw every frame
  - Cache rendered graphics when appropriate
- **Cache expensive operations**: 
  - Store noise values, complex math results, or color calculations when they don't change
  - Use lookup tables for frequently accessed values
- **Frame rate control**: 
  - Use `frameRate()` to control animation speed
  - Consider lower frame rates (30fps or 24fps) for artistic effect
  - Use `deltaTime` or frame counting for time-based animations
- **Graphics objects**: 
  - Use `p5.Graphics` for layered compositions
  - Reuse graphics buffers when possible
- **Particle systems**: 
  - Limit particle counts based on performance needs
  - Use efficient data structures (arrays, objects)
  - Consider culling off-screen particles

## Documentation and Reference

- **Always verify**: Check p5.js reference before suggesting functions: https://p5js.org/reference/
- **Use examples**: Reference p5.js examples when relevant: https://p5js.org/examples/
- **Version checking**: Verify features exist in latest p5.js version before suggesting
- **Include links**: Add links to relevant p5.js documentation in code comments for complex features
- **Community patterns**: Reference p5.js community best practices and common patterns
- **Function signatures**: Always use correct p5.js function signatures as documented
- **Reference format**: When referencing p5.js docs, use format: `// See: https://p5js.org/reference/#p5/[function]`

## File Organization

- **HTML structure**: Main HTML file should include:
  - p5.js CDN reference (latest version) or local library
  - Proper script loading order
  - Canvas container with appropriate styling
- **Sketch files**: 
  - Separate sketches into individual files for maintainability
  - Each sketch file should be self-contained
  - Use clear, descriptive file names
- **Utility modules**: 
  - Create utility modules for reusable functions
  - Examples: `utils/colors.js`, `utils/math.js`, `utils/helpers.js`
  - Export functions using ES6 modules or global namespace
- **Naming consistency**: 
  - Use consistent naming: `sketch-[name].js` or `[concept]-sketch.js`
  - Keep utility files lowercase with descriptive names
- **Documentation**: 
  - Include README.md explaining project structure
  - Document how to run sketches
  - Include notes on parameters and customization options

## Creative Coding Patterns

- **Experimentation**: Encourage exploration of p5.js features:
  - Shaders and WebGL for advanced graphics
  - Sound integration with p5.sound library
  - DOM manipulation with p5.dom
  - Image and video processing
- **Libraries**: Suggest p5.js libraries when appropriate:
  - `p5.sound` for audio-reactive art
  - `p5.dom` for UI elements
  - `p5.scribble` for hand-drawn aesthetics
  - Other community libraries as needed
- **Rendering modes**: 
  - Support both 2D (default) and 3D (WebGL) rendering modes
  - Use `WEBGL` parameter in `createCanvas()` for 3D
  - Consider performance implications of WebGL
- **Common generative techniques**: 
  - Particle systems with forces and fields
  - Noise-based generation (Perlin noise, Simplex noise)
  - L-systems and recursive patterns
  - Cellular automata
  - Flow fields and vector fields
  - Fractal generation
  - Voronoi diagrams and Delaunay triangulation
  - Reaction-diffusion systems

## Code Examples and Patterns

### Instance Mode Pattern (Multi-Sketch)
```javascript
// sketches/sketch-example.js
const sketch = (p) => {
  let particles = [];
  
  p.setup = () => {
    p.createCanvas(800, 600);
    // Initialize particles
  };
  
  p.draw = () => {
    p.background(220);
    // Draw particles
  };
};

// In main.js or index.html
new p5(sketch, 'canvas-container');
```

### Parameter Configuration Pattern
```javascript
// Config object for easy experimentation
const config = {
  particleCount: 100,
  noiseScale: 0.01,
  colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
  speed: 2
};
```

### Utility Function Pattern
```javascript
// utils/colors.js
/**
 * Generates a color from palette using modulo
 * @param {number} index - Index value
 * @param {p5.Color[]} palette - Color palette array
 * @returns {p5.Color} Color from palette
 */
function getColorFromPalette(index, palette) {
  return palette[index % palette.length];
}
```

## Additional Guidelines

- **Accessibility**: Consider accessibility when creating interactive art (keyboard navigation, screen reader support)
- **Responsive design**: Use `windowResized()` and `resizeCanvas()` for responsive sketches
- **Browser compatibility**: Test in modern browsers (Chrome, Firefox, Safari, Edge)
- **Error handling**: Include basic error handling for user inputs and edge cases
- **Code comments**: Balance between over-commenting and under-commenting - explain "why" not just "what"
- **Version control**: Use meaningful commit messages that describe artistic changes

## When in Doubt

1. Check the official p5.js reference: https://p5js.org/reference/
2. Look for examples: https://p5js.org/examples/
3. Verify function signatures match the latest documentation
4. Prefer p5.js built-in solutions over custom implementations
5. Consider performance implications of suggested code
6. Maintain clean, readable code that reflects artistic intent

