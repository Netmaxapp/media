// In-page timeline runtime. The renderer calls renderAt(t) once per frame, so every frame is
// deterministic. Elements opt in with data attributes.
//
// Entrances (data-in = start time). Pick the move with data-fx. VIDEO_STYLE.md says which move goes with
// which kind of element; one video uses at most three of them.
//   cut   on at data-in, no tween (default)
//   fade  opacity over data-dur (default 0.25 s), no movement
//   wipe  revealed left to right with a clip, over data-dur (default 0.45 s)
//   rise  fade + small rise (data-dy, default 12 px). Use once per video at most.
// Exits (data-out): a cut by default. data-odur > 0 fades out instead.
// There is no scale or "pop" move: editing rule 5 bans it, and the renderer fails if data-scale is used.
//
//   data-grow / data-gdur / data-axis="x|y"   a line draws on
//   data-count / data-cdur / data-from / data-to  a number counts up
//   data-type / data-tdur / data-text          text appears 3 words at a time (rule 1: no per-letter or per-word typing)
(() => {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const num = (el, k, d) => (el.dataset[k] !== undefined ? parseFloat(el.dataset[k]) : d);
  const FX = { cut: 0, fade: 0.25, wipe: 0.45, rise: 0.4 };

  window.renderAt = (t) => {
    for (const el of document.querySelectorAll('[data-in]')) {
      if (el.dataset.scale !== undefined) throw new Error('data-scale ("pop") is banned by editing rule 5');
      const fx = el.dataset.fx || 'cut';
      if (!(fx in FX)) throw new Error(`unknown data-fx "${fx}"`);
      const dur = num(el, 'dur', FX[fx]);
      const t0 = num(el, 'in', 0);
      const pi = dur === 0 ? (t >= t0 ? 1 : 0) : easeOut((t - t0) / dur);
      const tOut = num(el, 'out', Infinity), odur = num(el, 'odur', 0);
      const po = odur === 0 ? (t >= tOut ? 0 : 1) : 1 - easeOut((t - tOut) / odur);
      if (fx === 'wipe') {
        el.style.opacity = po;
        el.style.clipPath = `inset(-20px ${(1 - pi) * 100}% -20px -20px)`;
      } else {
        el.style.opacity = Math.min(fx === 'cut' ? (pi > 0 ? 1 : 0) : pi, po);
        el.style.transform = fx === 'rise' ? `translateY(${(1 - pi) * num(el, 'dy', 12)}px)` : '';
      }
    }
    for (const el of document.querySelectorAll('[data-grow]')) {
      const p = easeInOut((t - num(el, 'grow', 0)) / num(el, 'gdur', 0.8));
      el.style.transform = el.dataset.axis === 'y' ? `scaleY(${p})` : `scaleX(${p})`;
    }
    for (const el of document.querySelectorAll('[data-count]')) {
      const p = easeOut((t - num(el, 'count', 0)) / num(el, 'cdur', 1));
      el.textContent = Math.round(num(el, 'from', 0) + (num(el, 'to', 0) - num(el, 'from', 0)) * p);
    }
    for (const el of document.querySelectorAll('[data-type]')) {
      const words = el.dataset.text.split(' ');
      const chunks = Math.ceil(words.length / 3);
      const p = clamp((t - num(el, 'type', 0)) / num(el, 'tdur', 2));
      const shown = t < num(el, 'type', 0) ? 0 : Math.min(chunks, Math.floor(p * chunks) + 1);
      el.textContent = words.slice(0, shown * 3).join(' ');
    }
  };
})();
