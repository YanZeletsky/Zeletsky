const ptr = { x: 0, y: 0, tx: 0, ty: 0, on: 0, onT: 0, has: false };
function toStage(e) {
  const r = stage.getBoundingClientRect();
  return { x: e.clientX - r.left, y: r.height - (e.clientY - r.top), w: r.width, h: r.height };
}
function onMove(e) {
  const s = toStage(e);
  const inside = s.x >= 0 && s.y >= 0 && s.x <= s.w && s.y <= s.h;
  ptr.onT = inside ? 1 : 0;
  if (!inside) return;
  if (!ptr.has) { ptr.x = s.x; ptr.y = s.y; ptr.has = true; }
  ptr.tx = s.x;
  ptr.ty = s.y;
}
window.addEventListener('pointermove', onMove, { passive: true });
window.addEventListener('pointerdown', onMove, { passive: true });
window.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') ptr.onT = 0; });
document.addEventListener('pointerleave', () => { ptr.onT = 0; });

let last = performance.now(), clock = 2.2;
let fpsFrames = 0, fpsStamp = performance.now();
const fpsEl = document.getElementById('fps');
const ptsEl = document.getElementById('pts');
const ptsVal = document.getElementById('ptsVal');
ptsEl.addEventListener('input', () => {
  pointScale = Number(ptsEl.value);
  ptsEl.setAttribute('aria-valuenow', ptsEl.value);
  ptsVal.textContent = pointScale.toFixed(1) + '×';
  resizeFx();
});
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  fpsFrames += 1;
  if (now - fpsStamp >= 500) {
    fpsEl.textContent = Math.round(fpsFrames * 1000 / (now - fpsStamp)) + ' к/с';
    fpsFrames = 0;
    fpsStamp = now;
  }
  if (!prefersReduce) clock += dt;
  const sw = stage.clientWidth, sh = stage.clientHeight;
  ptr.x += (ptr.tx - ptr.x) * Math.min(1, dt * 8);
  ptr.y += (ptr.ty - ptr.y) * Math.min(1, dt * 8);
  ptr.on += (ptr.onT - ptr.on) * Math.min(1, dt * 4);
  fx.forEach(o => {
    const gl = o.gl;
    if (!gl || !o.prog || !o.card.offsetWidth || !o.card.offsetHeight) return;
    gl.useProgram(o.prog.prog);
    const u = o.prog.u;
    const cw = o.card.offsetWidth, ch = o.card.offsetHeight;
    gl.uniform1f(u.uTime, clock);
    gl.uniform2f(u.uStage, sw, sh);
    gl.uniform2f(u.uOrigin, o.card.offsetLeft, sh - (o.card.offsetTop + ch));
    gl.uniform2f(u.uCardSize, cw, ch);
    gl.uniform2f(u.uPointer, ptr.x, ptr.y);
    gl.uniform1f(u.uHoverOn, ptr.on);
    gl.uniform2f(u.uRes, o.cv.width, o.cv.height);
    applyPalette(gl, u, PALETTES[palIdx]);
    gl.bindBuffer(gl.ARRAY_BUFFER, o.quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  });
  requestAnimationFrame(frame);
}
resizeFx();
requestAnimationFrame(frame);


