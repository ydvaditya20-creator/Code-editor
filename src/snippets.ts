export interface CodeSnippet {
  id: string;
  name: string;
  description: string;
  code: string;
  category: 'HTML Markup' | 'CSS Styling' | 'JS Actions';
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  // HTML Snippets
  {
    id: 'html-grid',
    name: 'Responsive Bento Grid',
    description: 'A 3-column fluid grid that adapts smoothly to mobile viewports.',
    category: 'HTML Markup',
    code: `<div class="grid-container">
  <div class="grid-card">
    <h3>🔥 Featured Title</h3>
    <p>This is item number one.</p>
  </div>
  <div class="grid-card">
    <h3>⚡ Quick Speed</h3>
    <p>This is item number two.</p>
  </div>
  <div class="grid-card">
    <h3>🛡️ Premium Security</h3>
    <p>This is item number three.</p>
  </div>
</div>`
  },
  {
    id: 'html-form',
    name: 'Interactive Feedback Form',
    description: 'Modern feedback submission form fields with labels.',
    category: 'HTML Markup',
    code: `<form id="feedback-form" class="modern-form">
  <h2>📝 Send Feedback</h2>
  
  <div class="form-group">
    <label for="email-field">Email Address:</label>
    <input type="email" id="email-field" required placeholder="name@example.com" />
  </div>

  <div class="form-group">
    <label for="rating-field">Experience Rating:</label>
    <select id="rating-field">
      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
      <option value="4">⭐⭐⭐⭐ Good</option>
      <option value="3">⭐⭐⭐ Neutral</option>
    </select>
  </div>

  <div class="form-group">
    <label for="comments-field">Comments:</label>
    <textarea id="comments-field" rows="3" placeholder="Aapka sujhav likhein..."></textarea>
  </div>

  <button type="submit" class="submit-btn">Submit Review</button>
</form>`
  },
  {
    id: 'html-modal',
    name: 'Popup Modal Dialog',
    description: 'HTML markup structure for toggleable alert popup modals.',
    category: 'HTML Markup',
    code: `<!-- Modal Structure -->
<div id="popup-modal" class="modal-overlay hidden">
  <div class="modal-content">
    <h2>🎉 Success Alert!</h2>
    <p>Your workspace is updated and loaded successfully.</p>
    <div class="modal-actions">
      <button id="close-modal-btn" class="btn-close">Acknowledge</button>
    </div>
  </div>
</div>`
  },
  {
    id: 'html-tailwind-cdn',
    name: 'Tailwind V4 Browser CDN',
    description: 'Direct browser CDN import script for modern utility styling.',
    category: 'HTML Markup',
    code: `<!-- Import Tailwind CSS V4 CDN -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
`
  },

  // CSS Snippets
  {
    id: 'css-bento-layout',
    name: 'Bento Grid Layout',
    description: 'CSS Grid design style with beautiful glow cards.',
    category: 'CSS Styling',
    code: `/* Bento Grid Layout Style */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
}

.grid-card {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s, border-color 0.2s;
}

.grid-card:hover {
  transform: translateY(-4px);
  border-color: #6366f1;
}`
  },
  {
    id: 'css-glass',
    name: 'Glassmorphic Card Blur',
    description: 'Stunning glass overlay with frosted-back drop filter effect.',
    category: 'CSS Styling',
    code: `/* Glassmorphism Frosted Design */
.glass-panel {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  padding: 24px;
  color: #f8fafc;
}`
  },
  {
    id: 'css-shimmer',
    name: 'Animated Shimmer Glow',
    description: 'Modern skeleton loader skeleton loading animation.',
    category: 'CSS Styling',
    code: `/* Skeleton Shimmer Loading effect */
.shimmer {
  background: linear-gradient(
    90deg,
    #1e293b 25%,
    #334155 50%,
    #1e293b 75%
  );
  background-size: 200% 100%;
  animation: loading-pulse 1.6s infinite;
}

@keyframes loading-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
  },

  // JS Snippets
  {
    id: 'js-fetch',
    name: 'API Fetch Handler',
    description: 'Fetch modern JSON data with async-await & clean console logs.',
    category: 'JS Actions',
    code: `// Modern Dynamic JSON Fetcher
async function loadUserData() {
  const API_ENDPOINT = 'https://jsonplaceholder.typicode.com/posts/1';
  console.log("Fetching API records from: " + API_ENDPOINT);
  
  try {
    const response = await fetch(API_ENDPOINT);
    if (!response.ok) {
      throw new Error("HTTP connection failed: " + response.status);
    }
    const data = await response.json();
    console.log("🎉 Successfully fetched payload data:", data);
    
    // Inject response text to DOM output
    const output = document.getElementById('greeting-output');
    if (output) {
      output.textContent = data.title;
    }
  } catch (error) {
    console.error("❌ Failed API loader:", error.message);
  }
}

// Invoke loader
loadUserData();`
  },
  {
    id: 'js-cache',
    name: 'Local Caching Storage',
    description: 'Store/read persistent data elements directly from browser cache memory.',
    category: 'JS Actions',
    code: `// Get or Set item in standard LocalStorage
const STORAGE_KEY = 'user_score_history';

function saveScore(score) {
  try {
    localStorage.setItem(STORAGE_KEY, String(score));
    console.log("Cached score successfully:", score);
  } catch (e) {
    console.warn("Storage write blocked: ", e);
  }
}

function loadScore() {
  const score = localStorage.getItem(STORAGE_KEY);
  console.log("Loaded cached score:", score || "No score cached yet");
  return score ? Number(score) : 0;
}`
  },
  {
    id: 'js-audio',
    name: 'Synth Beep Generator',
    description: 'Synthesizes clean interactive beep sounds with browser Web Audio API.',
    category: 'JS Actions',
    code: `// Synthesizes a clean cyber beep sound
function playCyberBeep(frequency = 600, duration = 0.12) {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine'; // 'sine' | 'square' | 'triangle' | 'sawtooth'
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    
    // Smooth volume fade
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
    console.log(\`Played synthesized audio beep at \${frequency}Hz\`);
  } catch (e) {
    console.warn("Audio synthesis not initialized or blocked by browser user gesture.", e);
  }
}`
  }
];
