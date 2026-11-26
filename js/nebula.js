

/* Shapeless nebula, one sky across all cards. Numbers live in CONFIG. */

const CONFIG = {
  seed: [4.3, 1.7, 8.9],
  scale: 1.15,
  warp: 1.15,
  drift: 0.012,
  thresh: 0.58,
  soft: 0.09,
  filFreq: 7.0,
  filSharp: 3.2,
  clump: 8.0,
  hazeScale: 1.5,
  hazeAmount: 0.08,
  starBig: [18, 0.11, 0.055, 0.10],
  starMid: [48, 0.14, 0.028, 0.05],
  starTiny: [120, 0.16, 0.06, 0.12],
  spikeLen: 4.0,
  exposure: 0.72,
  glow: 1.0,
  space: '#04060e',
  core1: '#14388f',
  core2: '#2aa6c6',
  mid: '#e8b86a',
  edge: '#ff5f48',
  outer: '#8a2348',
  hot: '#ffe6c8',
  hazeA: '#1c1850',
  hazeB: '#5a1c50',
  starWhite: '#ffffff',
  starBlue: '#9cc2ff',
  starWarm: '#ffc890'
};

const PALETTES = [
  { name: 'Кольцо', space: '#04060e', core1: '#14388f', core2: '#2aa6c6', mid: '#e8b86a', edge: '#ff5f48', outer: '#8a2348', hot: '#ffe6c8', hazeA: '#1c1850', hazeB: '#5a1c50' }
];
let palIdx = 0;

const FRAG = `precision highp float;
uniform vec2 uRes, uStage, uOrigin, uCardSize, uPointer;
uniform float uTime, uHoverOn;
uniform vec3 uSeed;
uniform float uScale, uWarp, uDrift, uThresh, uSoft, uFilFreq, uFilSharp, uClump, uSpike, uExp, uGlow;
uniform vec2 uHaze;
uniform vec4 uStarB, uStarM, uStarT;
uniform vec3 uSpace, uCore1, uCore2, uMid, uEdge, uOuter, uHot, uHazeA, uHazeB, uSW, uSB, uSWm;

float h3(vec3 p){
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  float A = p.x * p.y * p.z;
  float s = p.x + p.y + p.z;
  float n = floor(A);
  return fract((A - n) * s + fract(n * fract(s)));
}
float n3(vec3 x){
  x = mod(x, 289.0);
  vec3 i = floor(x), f = fract(x); f = f*f*(3.0 - 2.0*f);
  return mix(mix(mix(h3(mod(i, 289.0)), h3(mod(i+vec3(1,0,0), 289.0)), f.x), mix(h3(mod(i+vec3(0,1,0), 289.0)), h3(mod(i+vec3(1,1,0), 289.0)), f.x), f.y),
             mix(mix(h3(mod(i+vec3(0,0,1), 289.0)), h3(mod(i+vec3(1,0,1), 289.0)), f.x), mix(h3(mod(i+vec3(0,1,1), 289.0)), h3(mod(i+vec3(1,1,1), 289.0)), f.x), f.y), f.z);
}
float fbm3(vec3 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 5; i++){
    s += a * n3(p);
    p = p * 2.03 + vec3(1.7, 9.2, 3.1);
    a *= 0.5;
  }
  return s;
}
vec3 stars(vec3 d, vec4 P, float spikes){
  vec3 g = d * P.x, id = floor(g), f = g - id;
  float h = h3(id + 7.1);
  if (h > P.y) return vec3(0.0);
  vec3 c = vec3(h3(id + 1.3), h3(id + 2.7), h3(id + 4.1)) * 0.36 + 0.32;
  float big = h3(id + 9.9);
  float r = mix(P.z, P.w, big);
  vec3 o = f - c;
  float dist = length(o);
  float core = exp(-pow(dist / r, 2.0) * 1.4);
  float glow = 0.30 / (1.0 + pow(dist / (r * 2.6), 2.0));
  float fade = 1.0 - smoothstep(0.14, 0.30, dist);
  float val = core + glow * smoothstep(0.35, 0.8, big) * fade;
  if (spikes > 0.5){
    vec3 t1 = normalize(cross(d, vec3(0.0, 1.0, 0.0)));
    vec3 t2 = cross(d, t1);
    float x = dot(o, t1), y = dot(o, t2);
    float sp = max(exp(-abs(y) / (r * 0.10)) * exp(-abs(x) / (r * uSpike)),
                   exp(-abs(x) / (r * 0.10)) * exp(-abs(y) / (r * uSpike)));
    val += sp * 0.8 * smoothstep(0.3, 0.9, big) * fade;
  }
  float tn = h3(id + 3.3);
  vec3 tint = tn < 0.55 ? uSW : (tn < 0.8 ? uSB : uSWm);
  vec3 edge = min(f, 1.0 - f);
  float win = smoothstep(0.0, 0.12, min(edge.x, min(edge.y, edge.z)));
  return tint * val * mix(0.55, 1.5, big) * win;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 px = uOrigin + uv * uCardSize;
  vec2 st = (px - 0.5 * uStage) / uStage.y;
  vec3 dir = normalize(vec3(st.x * 1.15, st.y * 1.15, 1.0));
  float t = uTime;

  vec3 p = vec3(st, 0.15) * uScale + uSeed + vec3(0.28, 0.42, 0.0);
  p += vec3(t * uDrift, t * uDrift * 0.45, t * 0.02);
  vec3 wv = vec3(fbm3(p * 0.7), fbm3(p * 0.7 + 7.0), fbm3(p * 0.7 + 13.0));
  float body = fbm3(p + wv * uWarp);
  float filN = fbm3(p * uFilFreq + wv * 1.6);
  float fil = pow(clamp(1.0 - abs(filN * 2.0 - 1.0), 0.0, 1.0), uFilSharp);
  float clump = fbm3(p * uClump + uSeed);

  float dens = smoothstep(uThresh, uThresh + uSoft, body);
  float core = smoothstep(uThresh + uSoft * 0.15, uThresh + uSoft * 1.35, body);
  float wisp = smoothstep(uThresh - 0.07, uThresh + 0.04, body) * (1.0 - dens);

  vec3 col = uSpace;
  float hz = fbm3(dir * uHaze.x + uSeed + vec3(20.0));
  float hzMix = fbm3(dir * 1.1 + uSeed * 1.7);
  col += mix(uHazeA, uHazeB, hzMix) * smoothstep(0.42, 0.78, hz) * uHaze.y;

  float rim = dens * (1.0 - core);
  vec3 gas = mix(uCore1, uCore2, core);
  gas = mix(gas, uMid, rim * 0.65);
  gas = mix(gas, uEdge, smoothstep(0.15, 0.85, rim));
  gas = mix(gas, uOuter, wisp);

  float shell = dens * (0.25 + 1.25 * fil) * (0.55 + 0.8 * clump);
  shell += wisp * fil * 0.85;
  col += gas * shell;
  col += uHot * pow(dens * fil, 2.3) * 0.45;

  vec2 pc = (uPointer - 0.5 * uStage) / uStage.y;
  float near = exp(-dot(st - pc, st - pc) * 7.5) * uHoverOn;
  float k = clamp(near * uGlow, 0.0, 1.0) * shell;
  float luma = dot(col, vec3(0.30, 0.55, 0.15));
  col = mix(col, mix(vec3(luma), col, 1.0 + 1.15 * k), k);

  col += stars(dir, uStarB, 1.0) + stars(dir, uStarM, 0.0) + stars(dir, uStarT, 0.0);
  col = 1.0 - exp(-col * uExp);
  gl_FragColor = vec4(pow(col, vec3(0.92)), 1.0);
}`;

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;

const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let pointScale = 1;
function pixelRatio() {
  return pointScale * (window.matchMedia("(max-width: 760px)").matches ? 0.7 : 1);
}

function compile(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error('SHADER:', gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

function makeProgram(gl) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.bindAttribLocation(prog, 0, 'p');
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('LINK:', gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);
  const names = ['uRes','uStage','uOrigin','uCardSize','uPointer','uTime','uHoverOn','uSeed','uScale','uWarp','uDrift','uThresh','uSoft','uFilFreq','uFilSharp','uClump','uSpike','uExp','uGlow','uHaze','uStarB','uStarM','uStarT','uSpace','uCore1','uCore2','uMid','uEdge','uOuter','uHot','uHazeA','uHazeB','uSW','uSB','uSWm'];
  const u = {};
  names.forEach(n => { u[n] = gl.getUniformLocation(prog, n); });
  const C = CONFIG;
  gl.uniform3fv(u.uSeed, C.seed);
  gl.uniform1f(u.uScale, C.scale);
  gl.uniform1f(u.uWarp, C.warp);
  gl.uniform1f(u.uDrift, C.drift);
  gl.uniform1f(u.uThresh, C.thresh);
  gl.uniform1f(u.uSoft, C.soft);
  gl.uniform1f(u.uFilFreq, C.filFreq);
  gl.uniform1f(u.uFilSharp, C.filSharp);
  gl.uniform1f(u.uClump, C.clump);
  gl.uniform1f(u.uSpike, C.spikeLen);
  gl.uniform1f(u.uExp, C.exposure);
  gl.uniform1f(u.uGlow, C.glow);
  gl.uniform2f(u.uHaze, C.hazeScale, C.hazeAmount);
  gl.uniform4fv(u.uStarB, C.starBig);
  gl.uniform4fv(u.uStarM, C.starMid);
  gl.uniform4fv(u.uStarT, C.starTiny);
  gl.uniform3fv(u.uSW, hex(C.starWhite));
  gl.uniform3fv(u.uSB, hex(C.starBlue));
  gl.uniform3fv(u.uSWm, hex(C.starWarm));
  return { prog, u };
}

function applyPalette(gl, u, pal) {
  gl.uniform3fv(u.uSpace, hex(pal.space));
  gl.uniform3fv(u.uCore1, hex(pal.core1));
  gl.uniform3fv(u.uCore2, hex(pal.core2));
  gl.uniform3fv(u.uMid, hex(pal.mid));
  gl.uniform3fv(u.uEdge, hex(pal.edge));
  gl.uniform3fv(u.uOuter, hex(pal.outer));
  gl.uniform3fv(u.uHot, hex(pal.hot));
  gl.uniform3fv(u.uHazeA, hex(pal.hazeA));
  gl.uniform3fv(u.uHazeB, hex(pal.hazeB));
}

const palTabs = document.getElementById('tabsPal');
PALETTES.forEach((pal, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.textContent = pal.name;
  b.setAttribute('aria-pressed', String(i === 0));
  b.addEventListener('click', () => {
    palIdx = i;
    palTabs.querySelectorAll('button').forEach((btn, k) => btn.setAttribute('aria-pressed', String(k === i)));
  });
  palTabs.appendChild(b);
});

const fx = [];
document.querySelectorAll('.card').forEach(card => {
  const cv = card.querySelector('.card__gl');
  const gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  const o = { card, cv, gl, prog: null };
  if (gl) {
    o.quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, o.quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    o.prog = makeProgram(gl);
  } else {
    cv.style.background = CONFIG.space;
  }
  fx.push(o);
});

// Reuse the same shader as the home cards; CSS mutes it to greyscale.
const updateCard = document.querySelector(".web-update__card");
const updateCanvas = updateCard.querySelector("canvas");
const updateGl = updateCanvas.getContext("webgl", {antialias:false, alpha:false, powerPreference:"low-power"});
if (updateGl) {
  const entry = {card:updateCard, cv:updateCanvas, gl:updateGl, prog:null};
  entry.quad = updateGl.createBuffer();
  updateGl.bindBuffer(updateGl.ARRAY_BUFFER, entry.quad);
  updateGl.bufferData(updateGl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), updateGl.STATIC_DRAW);
  entry.prog = makeProgram(updateGl);
  fx.push(entry);
}
function resizeFx() {
  const dpr = pixelRatio();
  fx.forEach(o => {
    const cw = o.card.offsetWidth, ch = o.card.offsetHeight;
    if (!cw || !ch) return;
    const w = Math.max(2, Math.round(cw * dpr)), h = Math.max(2, Math.round(ch * dpr));
    if (o.cv.width !== w || o.cv.height !== h) {
      o.cv.width = w;
      o.cv.height = h;
      if (o.gl) o.gl.viewport(0, 0, w, h);
    }
  });
}

const stage = document.getElementById('stage');
new ResizeObserver(() => {
  resizeFx();
}).observe(stage);
document.querySelectorAll('.card').forEach(c => new ResizeObserver(resizeFx).observe(c));
function watchDpr() {
  const q = matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
  q.addEventListener('change', () => { resizeFx(); watchDpr(); }, { once: true });
}
watchDpr();

