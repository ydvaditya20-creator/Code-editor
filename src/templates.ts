import { CodeTemplate } from './types';

export const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: 'starter',
    name: 'Simple Greeting Card',
    description: 'A clean, modern starting boilerplate with responsive interactive greeting.',
    category: 'Starter',
    html: `<!-- Modern Web Greeting -->
<div class="card-container">
  <div class="card animate-fade">
    <div class="card-header">
      <span class="badge">Live Preview</span>
      <h1>Hello Developers!</h1>
      <p class="subtitle">Welcome to your high-performance Web Code Editor</p>
    </div>
    
    <div class="card-body">
      <p>This sandbox supports live HTML, CSS, and interactive JavaScript with a console monitor.</p>
      
      <div class="form-group">
        <label for="name-input">Aapka Naam / Your Name:</label>
        <input type="text" id="name-input" placeholder="Apna naam likhein..." value="Guest Developer" />
      </div>
      
      <button id="greet-btn" class="btn-primary">Say Hello</button>
      
      <p id="greeting-output" class="output-text"></p>
    </div>
    
    <div class="card-footer">
      <p>Edit HTML, CSS or JS tabs to see changes instantly!</p>
    </div>
  </div>
</div>`,
    css: `/* Reset and Base Styling */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

/* Card Styling */
.card-container {
  width: 100%;
  max-width: 480px;
}

.card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
}

.card-header {
  margin-bottom: 24px;
}

.badge {
  display: inline-block;
  background: #38bdf8;
  color: #0f172a;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 9999px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
  margin-top: 6px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
}

input {
  background: #0f172a;
  border: 1px solid #334155;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

input:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.btn-primary {
  background: #38bdf8;
  color: #0f172a;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-block;
}

.btn-primary:hover {
  background: #7dd3fc;
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(1px);
}

.output-text {
  min-height: 24px;
  font-weight: 600;
  text-align: center;
  color: #10b981;
}

.card-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
  color: #64748b;
  text-align: center;
}

/* Custom Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fade {
  animation: fadeIn 0.4s ease-out forwards;
}`,
    js: `// Register event listeners
const greetBtn = document.getElementById('greet-btn');
const nameInput = document.getElementById('name-input');
const outputText = document.getElementById('greeting-output');

greetBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  console.log("Button clicked! Entered name:", name);
  
  if (name === '') {
    outputText.style.color = '#ef4444'; // Red for error
    outputText.textContent = 'Kripya apna naam likhein! (Please enter a name)';
    console.warn("Empty name input warning triggered.");
  } else {
    outputText.style.color = '#10b981'; // Green for success
    outputText.textContent = \`Aapka swagat hai, \${name}! ✨\`;
    console.log(\`Successfully greeted user: \${name}\`);
  }
});

// Trigger a default logs on load
console.log("Welcome code executed successfully. Waiting for click events...");
`
  },
  {
    id: 'counter',
    name: 'Interactive Counter & Timer',
    description: 'A beautiful counter dashboard with auto-timer toggle and history log list.',
    category: 'Interactive',
    html: `<div class="dashboard">
  <div class="widget">
    <h2>⚡ Counter Dashboard</h2>
    <div class="counter-display" id="counter-val">0</div>
    
    <div class="button-grid">
      <button id="btn-dec" class="btn btn-red">- Decrease</button>
      <button id="btn-reset" class="btn btn-slate">Reset</button>
      <button id="btn-inc" class="btn btn-green">+ Increase</button>
    </div>

    <div class="timer-section">
      <h3>⏰ Auto Timer (1s Interval)</h3>
      <div class="timer-controls">
        <span id="timer-status" class="status-badge offline">Stopped</span>
        <button id="btn-timer" class="btn btn-primary">Start Auto-Increment</button>
      </div>
    </div>

    <div class="history-section">
      <h3>📜 Activity Log</h3>
      <ul id="log-list" class="log-list">
        <li>Dashboard initialized...</li>
      </ul>
    </div>
  </div>
</div>`,
    css: `body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #0b0f19;
  color: #e2e8f0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  padding: 16px;
}

.dashboard {
  width: 100%;
  max-width: 440px;
}

.widget {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
}

h2 {
  margin-top: 0;
  text-align: center;
  color: #f3f4f6;
  font-weight: 600;
  font-size: 1.5rem;
}

h3 {
  font-size: 0.95rem;
  color: #9ca3af;
  margin-bottom: 8px;
  margin-top: 0;
  border-bottom: 1px solid #1f2937;
  padding-bottom: 6px;
}

.counter-display {
  font-size: 4.5rem;
  font-weight: 800;
  text-align: center;
  padding: 20px 0;
  color: #10b981;
  font-family: monospace;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.2);
  transition: all 0.15s ease;
}

.counter-display.pulse {
  transform: scale(1.1);
  color: #34d399;
}

.button-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
  margin-bottom: 24px;
}

.btn {
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
  transition: opacity 0.2s, transform 0.1s;
}

.btn:hover {
  opacity: 0.9;
}

.btn:active {
  transform: scale(0.96);
}

.btn-red { background-color: #ef4444; color: white; }
.btn-slate { background-color: #374151; color: white; }
.btn-green { background-color: #10b981; color: white; }
.btn-primary { background-color: #2563eb; color: white; width: 100%; }

.timer-section {
  background: #1f2937;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 20px;
}

.timer-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
}

.status-badge {
  font-size: 0.75rem;
  font-weight: bold;
  padding: 6px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}

.status-badge.online {
  background-color: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid #10b981;
}

.status-badge.offline {
  background-color: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid #ef4444;
}

.log-list {
  background-color: #030712;
  border-radius: 8px;
  height: 120px;
  overflow-y: auto;
  list-style: none;
  padding: 10px;
  margin: 0;
  font-family: monospace;
  font-size: 0.75rem;
  color: #a7f3d0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.log-list li {
  border-bottom: 1px solid #111827;
  padding-bottom: 2px;
}`,
    js: `let count = 0;
let timerId = null;

const display = document.getElementById('counter-val');
const btnDec = document.getElementById('btn-dec');
const btnReset = document.getElementById('btn-reset');
const btnInc = document.getElementById('btn-inc');
const btnTimer = document.getElementById('btn-timer');
const timerStatus = document.getElementById('timer-status');
const logList = document.getElementById('log-list');

function addLog(message) {
  const time = new Date().toLocaleTimeString();
  const li = document.createElement('li');
  li.textContent = \`[\${time}] \${message}\`;
  logList.appendChild(li);
  logList.scrollTop = logList.scrollHeight;
  console.log(\`Dashboard: \${message}\`);
}

function updateCount(val) {
  count = val;
  display.textContent = count;
  
  // Highlight animation pulse
  display.classList.add('pulse');
  setTimeout(() => display.classList.remove('pulse'), 150);
}

btnInc.addEventListener('click', () => {
  updateCount(count + 1);
  addLog(\`Incremented to \${count}\`);
});

btnDec.addEventListener('click', () => {
  updateCount(count - 1);
  addLog(\`Decremented to \${count}\`);
});

btnReset.addEventListener('click', () => {
  updateCount(0);
  addLog('Reset count to 0');
});

btnTimer.addEventListener('click', () => {
  if (timerId === null) {
    timerId = setInterval(() => {
      updateCount(count + 1);
      addLog(\`Auto-incremented to \${count}\`);
    }, 1000);
    
    timerStatus.textContent = 'Running';
    timerStatus.className = 'status-badge online';
    btnTimer.textContent = 'Stop Auto-Increment';
    btnTimer.style.backgroundColor = '#d97706'; // Amber color
    addLog('Auto increment started');
  } else {
    clearInterval(timerId);
    timerId = null;
    
    timerStatus.textContent = 'Stopped';
    timerStatus.className = 'status-badge offline';
    btnTimer.textContent = 'Start Auto-Increment';
    btnTimer.style.backgroundColor = '#2563eb'; // Blue
    addLog('Auto increment stopped');
  }
});`
  },
  {
    id: 'analog_clock',
    name: 'Neon Analog & Digital Clock',
    description: 'A gorgeous retro-modern glowing CSS & JS clock, showcasing custom HTML canvas drawing.',
    category: 'CSS Art',
    html: `<div class="clock-frame">
  <div class="neon-glow">
    <div class="analog-clock">
      <div class="hand hour" id="hour-hand"></div>
      <div class="hand minute" id="min-hand"></div>
      <div class="hand second" id="sec-hand"></div>
      <div class="center-pin"></div>
      
      <!-- Hour Numbers -->
      <div class="num n12">12</div>
      <div class="num n3">3</div>
      <div class="num n6">6</div>
      <div class="num n9">9</div>
    </div>
  </div>
  
  <div class="digital-display">
    <div id="digital-time">00:00:00 AM</div>
    <div id="digital-date">Monday, January 1</div>
  </div>
</div>`,
    css: `body {
  background-color: #050508;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
}

.clock-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.neon-glow {
  position: relative;
  background: #0d0d1a;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 40px #c084fc, inset 0 0 20px rgba(192, 132, 252, 0.4);
  border: 4px solid #c084fc;
}

.analog-clock {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, #121226 0%, #06060c 100%);
  border-radius: 50%;
  position: relative;
}

.center-pin {
  width: 14px;
  height: 14px;
  background: #f43f5e;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  box-shadow: 0 0 10px #f43f5e;
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 4px;
}

.hour {
  width: 6px;
  height: 60px;
  background: #ffffff;
  margin-left: -3px;
  z-index: 5;
}

.minute {
  width: 4px;
  height: 90px;
  background: #a855f7;
  margin-left: -2px;
  z-index: 6;
  box-shadow: 0 0 8px #a855f7;
}

.second {
  width: 2px;
  height: 110px;
  background: #f43f5e;
  margin-left: -1px;
  z-index: 7;
  box-shadow: 0 0 10px #f43f5e;
}

.num {
  position: absolute;
  font-weight: bold;
  font-size: 1.25rem;
  color: #cbd5e1;
}

.n12 { top: 15px; left: 50%; transform: translateX(-50%); }
.n3 { right: 15px; top: 50%; transform: translateY(-50%); }
.n6 { bottom: 15px; left: 50%; transform: translateX(-50%); }
.n9 { left: 15px; top: 50%; transform: translateY(-50%); }

.digital-display {
  text-align: center;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 16px 24px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
}

#digital-time {
  font-size: 1.8rem;
  font-weight: bold;
  color: #38bdf8;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
  letter-spacing: 1px;
}

#digital-date {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 6px;
  text-transform: uppercase;
  letter-spacing: 2px;
}`,
    js: `const hourHand = document.getElementById('hour-hand');
const minHand = document.getElementById('min-hand');
const secHand = document.getElementById('sec-hand');
const digitalTime = document.getElementById('digital-time');
const digitalDate = document.getElementById('digital-date');

function updateClock() {
  const now = new Date();
  
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  
  // Calculate analog degrees
  const secDegs = (seconds / 60) * 360;
  const minDegs = ((minutes + seconds / 60) / 60) * 360;
  const hourDegs = (((hours % 12) + minutes / 60) / 12) * 360;
  
  // Apply rotation
  secHand.style.transform = \`rotate(\${secDegs}deg)\`;
  minHand.style.transform = \`rotate(\${minDegs}deg)\`;
  hourHand.style.transform = \`rotate(\${hourDegs}deg)\`;
  
  // Update Digital Time
  let displayHours = hours % 12;
  displayHours = displayHours ? displayHours : 12; // convert '0' to '12'
  const displayMins = String(minutes).padStart(2, '0');
  const displaySecs = String(seconds).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  digitalTime.textContent = \`\${displayHours}:\${displayMins}:\${displaySecs} \${ampm}\`;
  
  // Update Digital Date
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  digitalDate.textContent = now.toLocaleDateString('en-US', options);
}

// Tick once and start interval
updateClock();
setInterval(updateClock, 1000);

console.log("Neon Clock system running smoothly.");`
  },
  {
    id: 'physics_bouncing_ball',
    name: 'Interactive Ball Physics',
    description: 'An HTML5 Canvas simulation with dynamic ball collision, gravity controls, and mouse attraction.',
    category: 'Games',
    html: `<div class="physics-container">
  <div class="control-panel">
    <h3>Gravity Workspace</h3>
    <div class="sliders">
      <div class="control-row">
        <label for="gravity-input">Gravity (g): <span id="lbl-gravity">0.5</span></label>
        <input type="range" id="gravity-input" min="0" max="2" step="0.1" value="0.5" />
      </div>
      <div class="control-row">
        <label for="friction-input">Bounce Loss: <span id="lbl-friction">0.8</span></label>
        <input type="range" id="friction-input" min="0.5" max="1" step="0.02" value="0.8" />
      </div>
    </div>
    <div class="button-row">
      <button id="btn-clear-balls" class="btn btn-red">Clear Canvas</button>
      <button id="btn-add-ball" class="btn btn-green">Spawn Random Ball</button>
    </div>
    <p class="guide-text">💡 Click on the canvas to shoot new balls! Double click to apply gravity blast!</p>
  </div>
  
  <canvas id="physics-canvas"></canvas>
</div>`,
    css: `body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #030712;
  font-family: system-ui, sans-serif;
  color: white;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.physics-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

.control-panel {
  background-color: #0f172a;
  border-bottom: 2px solid #334155;
  padding: 12px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  z-index: 10;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #38bdf8;
  font-weight: 700;
}

.sliders {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 140px;
}

label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

input[type="range"] {
  width: 100%;
  accent-color: #38bdf8;
}

.button-row {
  display: flex;
  gap: 8px;
}

.btn {
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-red { background: #ef4444; color: white; }
.btn-green { background: #10b981; color: white; }
.btn:hover { opacity: 0.9; }

.guide-text {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  width: 100%;
}

#physics-canvas {
  flex-grow: 1;
  display: block;
  background: radial-gradient(circle at center, #0f172a 0%, #030712 100%);
  cursor: crosshair;
}`,
    js: `const canvas = document.getElementById('physics-canvas');
const ctx = canvas.getContext('2d');

const gravityInput = document.getElementById('gravity-input');
const frictionInput = document.getElementById('friction-input');
const lblGravity = document.getElementById('lbl-gravity');
const lblFriction = document.getElementById('lbl-friction');
const btnClear = document.getElementById('btn-clear-balls');
const btnAdd = document.getElementById('btn-add-ball');

let gravity = 0.5;
let bounceLoss = 0.8; // Bounce retention coefficient (friction)
let balls = [];

// Handle canvas sizing
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Ball object class
class Ball {
  constructor(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    
    // Glowing gradient fill
    const grad = ctx.createRadialGradient(this.x, this.y, 2, this.x, this.y, this.radius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, this.color);
    grad.addColorStop(1, '#000000');
    
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    // Bottom wall bounce
    if (this.y + this.radius + this.dy > canvas.height) {
      this.dy = -this.dy * bounceLoss;
      this.y = canvas.height - this.radius; // align with boundary
    } else {
      this.dy += gravity; // Gravity pull
    }

    // Side wall bounce
    if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius + this.dx < 0) {
      this.dx = -this.dx * bounceLoss;
    }

    // Apply speed
    this.x += this.dx;
    this.y += this.dy;

    this.draw();
  }
}

// Generate random colors
const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899'];
function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function spawnBall(x, y) {
  const r = Math.random() * 15 + 10;
  const dx = (Math.random() - 0.5) * 12;
  const dy = (Math.random() - 0.5) * 8 - 4;
  const color = randomColor();
  
  balls.push(new Ball(x, y, dx, dy, r, color));
  console.log(\`Spawned ball at (\${Math.round(x)}, \${Math.round(y)}) with size \${Math.round(r)}px\`);
}

// Sliders config
gravityInput.addEventListener('input', (e) => {
  gravity = parseFloat(e.target.value);
  lblGravity.textContent = gravity.toFixed(1);
});

frictionInput.addEventListener('input', (e) => {
  bounceLoss = parseFloat(e.target.value);
  lblFriction.textContent = bounceLoss.toFixed(2);
});

btnClear.addEventListener('click', () => {
  balls = [];
  console.log("Canvas cleared.");
});

btnAdd.addEventListener('click', () => {
  spawnBall(canvas.width / 2, 40);
});

// Click to spawn ball
canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  spawnBall(x, y);
});

// Double click to blast gravity upwards
canvas.addEventListener('dblclick', () => {
  console.log("Gravity Blast triggered! Pushing all balls upward.");
  balls.forEach(ball => {
    ball.dy = -15 - Math.random() * 5;
    ball.dx += (Math.random() - 0.5) * 10;
  });
});

// Initialize with some default balls
for (let i = 0; i < 6; i++) {
  spawnBall(100 + i * 80, 100);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  balls.forEach(ball => {
    ball.update();
  });
}

animate();
console.log("Physics Canvas Engine loaded successfully.");`
  },
  {
    id: 'ecommerce',
    name: 'Modern E-Commerce Store',
    description: 'An immersive shop experience with responsive layout, real-time cart calculations, coupon system, and search filters.',
    category: 'Interactive',
    html: `<!-- Tailwind v4 browser runtime for beautiful storefront design -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

<div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
  <!-- Navigation Header -->
  <header class="border-b border-slate-800 bg-slate-900/85 sticky top-0 backdrop-blur z-50 px-4 py-3">
    <div class="max-w-6xl mx-auto flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🛍️</span>
        <span class="text-lg font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">TechGadget Store</span>
      </div>
      
      <!-- Search Input -->
      <div class="flex-1 max-w-md relative hidden md:block">
        <input type="text" id="search-input" placeholder="Search gadgets... (e.g. keyboard, mouse)" class="w-full bg-slate-950 border border-slate-800 rounded-full py-1.5 px-4 text-xs outline-none focus:border-cyan-400 text-slate-200 transition" />
      </div>

      <!-- Cart Trigger Button -->
      <button id="cart-toggle-btn" class="relative flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-xs font-bold transition">
        <span>🛒 Cart</span>
        <span id="cart-badge" class="bg-cyan-500 text-slate-950 text-[10px] font-extrabold h-5 w-5 rounded-full flex items-center justify-center">0</span>
      </button>
    </div>
  </header>

  <!-- Main Body Grid -->
  <main class="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
    <!-- Filters Sidebar -->
    <aside class="space-y-4">
      <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-3">Categories</h3>
        <div class="space-y-1" id="category-filter-group">
          <button class="filter-btn active w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" data-category="all">All Tech</button>
          <button class="filter-btn w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 text-slate-300" data-category="audio">Audio Beats</button>
          <button class="filter-btn w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 text-slate-300" data-category="peripherals">Peripherals</button>
          <button class="filter-btn w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 text-slate-300" data-category="wearables">Smart Wearables</button>
        </div>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Promo Code</h3>
        <p class="text-[10px] text-slate-500 mb-3">Apply discount coupon <strong>SUPER15</strong> for 15% off!</p>
        <div class="flex gap-1.5">
          <input type="text" id="coupon-field" placeholder="SUPER15" class="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs outline-none flex-1 font-mono uppercase text-center" />
          <button id="coupon-apply-btn" class="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 text-xs font-bold rounded transition">Apply</button>
        </div>
        <p id="coupon-status" class="text-[10px] text-center mt-2 font-medium hidden"></p>
      </div>
    </aside>

    <!-- Products Shelf Grid -->
    <section class="lg:col-span-3">
      <div class="flex items-center justify-between mb-4">
        <p class="text-xs text-slate-400">Showing <span id="product-count" class="text-white font-bold">6</span> premium gadgets</p>
        <select id="sort-select" class="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs outline-none">
          <option value="default">Sort: Recommended</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      <div id="products-grid" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <!-- Products injected via JS -->
      </div>
    </section>
  </main>

  <!-- Sliding Cart Overlay Drawer -->
  <div id="cart-drawer" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity pointer-events-none opacity-0">
    <div class="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-900 border-l border-slate-800 p-5 flex flex-col justify-between shadow-2xl">
      <div>
        <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h2 class="text-sm font-bold flex items-center gap-1.5">🛒 Your Tech Bag <span id="drawer-count" class="bg-slate-800 text-xs px-2 py-0.5 rounded-full text-slate-300">0</span></h2>
          <button id="cart-close-btn" class="text-slate-400 hover:text-white font-bold text-lg select-none">&times;</button>
        </div>

        <!-- Cart List items scrollbar -->
        <div id="cart-items-container" class="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          <p class="text-xs text-slate-500 text-center py-8">Your shopping cart is currently empty.</p>
        </div>
      </div>

      <!-- Order Pricing Receipt summary -->
      <div class="border-t border-slate-800 pt-4 space-y-2 text-xs">
        <div class="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span id="price-subtotal">$0.00</span>
        </div>
        <div class="flex justify-between text-rose-400 hidden" id="discount-row">
          <span>15% Discount Applied</span>
          <span id="price-discount">-$0.00</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>Estimated Sales Tax</span>
          <span id="price-tax">$0.00</span>
        </div>
        <div class="flex justify-between font-extrabold text-white text-sm border-t border-dashed border-slate-800 pt-2">
          <span>Total Price</span>
          <span id="price-total">$0.00</span>
        </div>
        <button id="checkout-btn" class="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-extrabold py-2.5 rounded-lg mt-4 shadow-lg hover:brightness-110 active:scale-[0.98] transition">Secure Checkout</button>
      </div>
    </div>
  </div>

  <!-- Footer Info -->
  <footer class="border-t border-slate-900 py-6 text-center text-xs text-slate-600 bg-[#06080e]">
    <p>&copy; TechGadget Interactive Code Sandbox Project. Fully Functional Client-Side Demo.</p>
  </footer>
</div>`,
    css: `/* Custom slider styles and animation frames */
.filter-btn {
  transition: all 0.15s ease-in-out;
}
.hidden {
  display: none !important;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}`,
    js: `// Premium E-Commerce Products dataset
const PRODUCTS = [
  { id: 'gadget-1', name: 'Cyber Studio Pro Headset', category: 'audio', price: 129.99, rating: 4.8, badge: 'Hot', image: '🎧' },
  { id: 'gadget-2', name: 'Rapid mechanical keyboard', category: 'peripherals', price: 89.49, rating: 4.7, badge: 'Popular', image: '⌨️' },
  { id: 'gadget-3', name: 'Precision Esports Mouse', category: 'peripherals', price: 59.99, rating: 4.9, badge: 'Pro', image: '🖱️' },
  { id: 'gadget-4', name: 'Vibrant OLED Smartwatch', category: 'wearables', price: 179.99, rating: 4.5, badge: 'New', image: '⌚' },
  { id: 'gadget-5', name: 'SoundSurge Wireless buds', category: 'audio', price: 45.00, rating: 4.2, badge: 'Sale', image: '🎵' },
  { id: 'gadget-6', name: 'CyberRGB Ultra Mousepad', category: 'peripherals', price: 29.99, rating: 4.6, badge: null, image: '⏹️' }
];

let cart = [];
let discountMultiplier = 1.0; // 15% discount -> 0.85

// Select Dom elements
const productsGrid = document.getElementById('products-grid');
const cartToggle = document.getElementById('cart-toggle-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartClose = document.getElementById('cart-close-btn');
const cartBadge = document.getElementById('cart-badge');
const drawerCount = document.getElementById('drawer-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const categoryButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sort-select');
const searchInput = document.getElementById('search-input');
const couponField = document.getElementById('coupon-field');
const couponApplyBtn = document.getElementById('coupon-apply-btn');
const couponStatus = document.getElementById('coupon-status');
const discountRow = document.getElementById('discount-row');
const checkoutBtn = document.getElementById('checkout-btn');

// Print loaded templates logs
console.log("Loading E-Commerce Gadget Store template...");

// Render Product Cards
function renderProducts(filterCategory = 'all', searchFilter = '', sortBy = 'default') {
  let filtered = PRODUCTS.filter(p => {
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    const matchSearch = p.name.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCat && matchSearch;
  });

  // Sort
  if (sortBy === 'low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  productsGrid.innerHTML = '';
  document.getElementById('product-count').textContent = filtered.length;

  if (filtered.length === 0) {
    productsGrid.innerHTML = \`<div class="col-span-full py-12 text-center text-slate-500">
      <p class="text-sm">No match found for "\${searchFilter}". Try typing another keyword!</p>
    </div>\`;
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition relative group';
    
    // Badge label
    const badgeHTML = p.badge 
      ? \`<span class="absolute top-3 left-3 bg-cyan-500 text-slate-950 font-extrabold text-[9px] px-2 py-0.5 rounded-full uppercase">\${p.badge}</span>\` 
      : '';

    card.innerHTML = \`
      \${badgeHTML}
      <div class="text-slate-400 text-xs text-right select-none">⭐️ \${p.rating}</div>
      <div class="text-4xl text-center py-6 group-hover:scale-110 transition duration-300">\${p.image}</div>
      <div>
        <h4 class="font-bold text-sm text-white leading-tight">\${p.name}</h4>
        <p class="text-slate-500 text-xs mt-1 capitalize">\${p.category}</p>
      </div>
      <div class="flex items-center justify-between mt-4">
        <span class="font-extrabold text-sm text-cyan-400">$\${p.price.toFixed(2)}</span>
        <button onclick="addToCart('\${p.id}')" class="bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition duration-200">
          Add +
        </button>
      </div>
    \`;
    productsGrid.appendChild(card);
  });
}

// Add Item to cart function (exposed globally for HTML onclick event)
window.addToCart = function(productId) {
  const item = PRODUCTS.find(p => p.id === productId);
  if (!item) return;

  const existing = cart.find(c => c.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  console.log(\`Added \${item.name} to cart. Quantity: \${existing ? existing.quantity : 1}\`);
  updateCartUI();
};

// Remove or Decrease from cart
window.removeFromCart = function(productId, forceAll = false) {
  const existing = cart.find(c => c.id === productId);
  if (!existing) return;

  if (forceAll || existing.quantity <= 1) {
    cart = cart.filter(c => c.id !== productId);
  } else {
    existing.quantity -= 1;
  }
  updateCartUI();
};

// Calculate pricing and update badge numbers
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;
  drawerCount.textContent = totalItems;

  cartItemsContainer.innerHTML = '';

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-xs text-slate-500 text-center py-12">Your shopping cart is currently empty.</p>';
  } else {
    cart.forEach(c => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between gap-2 border-b border-slate-850 py-2 text-xs';
      row.innerHTML = \`
        <div class="flex items-center gap-2">
          <span class="text-xl">\${c.image}</span>
          <div>
            <h5 class="font-bold text-slate-200 leading-tight">\${c.name}</h5>
            <p class="text-[10px] text-slate-500">$\${c.price.toFixed(2)} each</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="flex items-center bg-slate-950 border border-slate-800 rounded overflow-hidden">
            <button onclick="removeFromCart('\${c.id}')" class="px-1.5 py-0.5 hover:bg-slate-800 text-slate-400 font-bold">-</button>
            <span class="px-2 text-[11px] font-mono">\${c.quantity}</span>
            <button onclick="addToCart('\${c.id}')" class="px-1.5 py-0.5 hover:bg-slate-800 text-slate-400 font-bold">+</button>
          </div>
          <button onclick="removeFromCart('\${c.id}', true)" class="text-rose-500 hover:text-rose-400 ml-1 font-bold">🗑️</button>
        </div>
      \`;
      cartItemsContainer.appendChild(row);
    });
  }

  // Calculate pricing math
  const subtotal = cart.reduce((sum, c) => sum + (c.price * c.quantity), 0);
  const discountAmount = subtotal * (1 - discountMultiplier);
  const tax = (subtotal - discountAmount) * 0.08; // 8% sales tax
  const total = (subtotal - discountAmount) + tax;

  document.getElementById('price-subtotal').textContent = \`$\${subtotal.toFixed(2)}\`;
  document.getElementById('price-discount').textContent = \`-\$\${discountAmount.toFixed(2)}\`;
  document.getElementById('price-tax').textContent = \`$\${tax.toFixed(2)}\`;
  document.getElementById('price-total').textContent = \`$\${total.toFixed(2)}\`;

  if (discountMultiplier < 1.0) {
    discountRow.classList.remove('hidden');
  } else {
    discountRow.classList.add('hidden');
  }
}

// Bind drawer slide triggers
cartToggle.addEventListener('click', () => {
  cartDrawer.classList.remove('pointer-events-none', 'opacity-0');
  cartDrawer.querySelector('div').classList.remove('translate-x-full');
});

cartClose.addEventListener('click', () => {
  cartDrawer.classList.add('pointer-events-none', 'opacity-0');
});

// Category Click Filters
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryButtons.forEach(b => b.className = 'filter-btn w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 text-slate-300');
    btn.className = 'filter-btn active w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    
    const cat = btn.getAttribute('data-category');
    renderProducts(cat, searchInput.value, sortSelect.value);
  });
});

// Real-time keyboard search filtering
searchInput.addEventListener('input', () => {
  const activeCat = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all';
  renderProducts(activeCat, searchInput.value, sortSelect.value);
});

sortSelect.addEventListener('change', () => {
  const activeCat = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all';
  renderProducts(activeCat, searchInput.value, sortSelect.value);
});

// Apply Coupon coupon validation logic
couponApplyBtn.addEventListener('click', () => {
  const code = couponField.value.trim().toUpperCase();
  if (code === 'SUPER15') {
    discountMultiplier = 0.85; // 15% discount
    couponStatus.textContent = '🎉 Promo code SUPER15 loaded! 15% discount applied.';
    couponStatus.className = 'text-[10px] text-center mt-2 font-medium text-emerald-400 block';
    updateCartUI();
    console.log("Promo code SUPER15 applied successfully.");
  } else {
    couponStatus.textContent = '❌ Invalid code. Try SUPER15';
    couponStatus.className = 'text-[10px] text-center mt-2 font-medium text-rose-400 block';
    console.warn("Invalid coupon attempt: " + code);
  }
});

// Final checkout simulator popup
checkoutBtn.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Please add at least one gadget to your tech bag first!");
    return;
  }
  const totalAmt = document.getElementById('price-total').textContent;
  alert(\`🎉 Checkout Success! Your order of \${totalAmt} is processed. Thank you for using TechGadget!\`);
  cart = [];
  updateCartUI();
  cartDrawer.classList.add('pointer-events-none', 'opacity-0');
  console.log("Checkout transaction completed successfully. Cart reset.");
});

// Initialize view
renderProducts();
updateCartUI();
`
  },
  {
    id: 'brick_breaker',
    name: 'Retro Brick-Breaker Game',
    description: 'A classic high-performance 2D arcade physics game with collision angles, scoring, high scores, and live synthesizers.',
    category: 'Games',
    html: `<div class="game-container">
  <div class="hud">
    <div class="score-card">Score: <span id="game-score" class="font-mono">0</span></div>
    <div class="lives-card">Lives: <span id="game-lives">❤️❤️❤️</span></div>
    <div class="high-score-card">Best: <span id="high-score" class="font-mono">0</span></div>
  </div>

  <div class="canvas-wrapper">
    <canvas id="game-canvas"></canvas>
    <div id="start-screen" class="overlay">
      <h2>👾 Brick Breaker</h2>
      <p>Smash all the digital bricks using your reflective kinetic paddle!</p>
      <button id="start-btn" class="btn btn-green">Launch Game</button>
      <p class="controls-guide">👈 Drag Mouse or use Left/Right Arrow keys to Move 👉</p>
    </div>

    <div id="game-over-screen" class="overlay hidden">
      <h2 id="game-over-title" class="text-red-500">💥 Game Over</h2>
      <p>Final Score: <span id="final-score">0</span></p>
      <button id="restart-btn" class="btn btn-blue">Try Again</button>
    </div>
  </div>
  
  <div class="sound-toggle">
    <label class="sound-lbl">
      <input type="checkbox" id="sound-checkbox" checked />
      🔈 Enable Synthesizer Sound Effects
    </label>
  </div>
</div>`,
    css: `body {
  margin: 0;
  padding: 0;
  background-color: #020617;
  color: #f1f5f9;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.game-container {
  width: 100%;
  max-width: 560px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #020617;
  border: 1px solid #1e293b;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.canvas-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background-color: #020617;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid #1e293b;
}

#game-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 24px;
  z-index: 10;
}

.overlay h2 {
  font-size: 2rem;
  margin-top: 0;
  margin-bottom: 10px;
  font-weight: 800;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.overlay p {
  font-size: 0.9rem;
  color: #94a3b8;
  max-width: 380px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.controls-guide {
  font-size: 0.75rem !important;
  color: #475569 !important;
  margin-top: 20px !important;
}

.btn {
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.btn-green { background: #10b981; color: #020617; }
.btn-green:hover { background: #34d399; transform: translateY(-1px); }
.btn-blue { background: #2563eb; color: white; }
.btn-blue:hover { background: #3b82f6; transform: translateY(-1px); }

.hidden { display: none !important; }

.sound-toggle {
  margin-top: 12px;
  text-align: center;
}

.sound-lbl {
  font-size: 0.75rem;
  color: #64748b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
}

#sound-checkbox {
  accent-color: #10b981;
}`,
    js: `const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const gameOverTitle = document.getElementById('game-over-title');
const restartBtn = document.getElementById('restart-btn');
const scoreLabel = document.getElementById('game-score');
const finalScoreLabel = document.getElementById('final-score');
const livesLabel = document.getElementById('game-lives');
const highScoreLabel = document.getElementById('high-score');
const soundCheckbox = document.getElementById('sound-checkbox');

// Canvas coordinate sizing (independent of viewport resize)
canvas.width = 480;
canvas.height = 360;

// Game variable states
let score = 0;
let lives = 3;
let highScore = localStorage.getItem('brick_breaker_highscore') || 0;
highScoreLabel.textContent = highScore;

let gameActive = false;
let rightPressed = false;
let leftPressed = false;

// Audio synth generator for retro experience
function beep(freq, duration) {
  if (!soundCheckbox.checked) return;
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch(e) {}
}

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleSpeed = 7;

// Ball properties
let ballRadius = 6;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

// Brick layout config
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 55;
const brickHeight = 16;
const brickPadding = 6;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Injected Colors
const BRICK_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#3b82f6'];

let bricks = [];
function initializeBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1, color: BRICK_COLORS[r] };
    }
  }
}

// Inputs listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener('mousemove', mouseMoveHandler, false);

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') { rightPressed = true; }
  else if (e.key === 'Left' || e.key === 'ArrowLeft') { leftPressed = true; }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') { rightPressed = false; }
  else if (e.key === 'Left' || e.key === 'ArrowLeft') { leftPressed = false; }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.getBoundingClientRect().left;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

// Collisions logic
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
          score += 10;
          scoreLabel.textContent = score;
          
          beep(200 + r * 100, 0.08); // High tone beep on smash
          
          // Check for complete clear win
          if (score === brickRowCount * brickColumnCount * 10) {
            endGame(true);
          }
        }
      }
    }
  }
}

// Draw Functions
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = '#60a5fa'; // neon cyan blue
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#a78bfa'; // neon purple
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  if (!gameActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // Wall collisions (Left & Right)
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
    beep(150, 0.05);
  }
  
  // Ceiling wall collision
  if (y + dy < ballRadius) {
    dy = -dy;
    beep(150, 0.05);
  } else if (y + dy > canvas.height - ballRadius - 5) {
    // Paddle bounce collision check
    if (x > paddleX && x < paddleX + paddleWidth) {
      // Calculate reflective rebound angle depending on landing point
      const relativeHit = (x - (paddleX + paddleWidth/2)) / (paddleWidth/2);
      dx = relativeHit * 4.5;
      dy = -dy;
      beep(300, 0.08);
    } else {
      // Fall down
      lives--;
      updateLivesDisplay();
      beep(100, 0.25); // low buzz on lose
      
      if (!lives) {
        endGame(false);
      } else {
        // Reset ball position
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  // Auto move paddle on keys press
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed;
  }

  x += dx;
  y += dy;

  requestAnimationFrame(draw);
}

function updateLivesDisplay() {
  livesLabel.textContent = '❤️'.repeat(lives) || '💔';
}

function startGame() {
  startScreen.classList.add('hidden');
  gameOverScreen.classList.add('hidden');
  
  score = 0;
  lives = 3;
  scoreLabel.textContent = score;
  updateLivesDisplay();
  
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2.5 + Math.random();
  dy = -3;
  paddleX = (canvas.width - paddleWidth) / 2;
  
  initializeBricks();
  gameActive = true;
  beep(440, 0.15); // Start synth beep
  draw();
  console.log("Dinosaur brick breaker game started!");
}

function endGame(won) {
  gameActive = false;
  gameOverScreen.classList.remove('hidden');
  finalScoreLabel.textContent = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('brick_breaker_highscore', highScore);
    highScoreLabel.textContent = highScore;
    console.log("New high score cached locally: " + highScore);
  }

  if (won) {
    gameOverTitle.textContent = '🏆 VICTORY!';
    gameOverTitle.className = 'text-emerald-400 text-2xl font-black';
    beep(600, 0.3);
  } else {
    gameOverTitle.textContent = '💥 Game Over';
    gameOverTitle.className = 'text-rose-500 text-2xl font-black';
  }
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

console.log("Brick Breaker physics logic fully initialized.");`
  }
];
