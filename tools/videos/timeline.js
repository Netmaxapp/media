// In-page timeline runtime. The renderer calls renderAt(t) once per frame, so every frame is
// deterministic. Elements opt in with data attributes:
//   data-in / data-dur / data-out / data-odur / data-dy / data-scale  fade + rise in, fade out
//   data-grow / data-gdur / data-axis="x|y"                             line draws on
//   data-count / data-cdur / data-from / data-to                       number counts up
//   data-type / data-tdur / data-text                                  text types out
(() => {
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeInOut = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const num = (el, k, d) => (el.dataset[k] !== undefined ? parseFloat(el.dataset[k]) : d);

  window.renderAt = (t) => {
    for (const el of document.querySelectorAll('[data-in]')) {
      const pi = easeOut((t - num(el, 'in', 0)) / num(el, 'dur', 0.5));
      const po = 1 - easeOut((t - num(el, 'out', Infinity)) / num(el, 'odur', 0.4));
      el.style.opacity = Math.min(pi, po);
      el.style.transform = `translateY(${(1 - pi) * num(el, 'dy', 28)}px) scale(${1 - (1 - pi) * num(el, 'scale', 0)})`;
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
      const txt = el.dataset.text;
      const p = clamp((t - num(el, 'type', 0)) / num(el, 'tdur', 2));
      el.textContent = txt.slice(0, Math.round(txt.length * p));
      el.classList.toggle('typing', p > 0 && p < 1);
    }
  };
})();
