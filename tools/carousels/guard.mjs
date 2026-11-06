// Editing rules 2, 3 and 6 (CONTENT_RULES.md), checked on the rendered page, not on the source.
// Runs inside the browser via page.evaluate(styleGuard, rootSelector) and returns a list of problems.
// Rule 2: no italic or oblique type anywhere.
// Rule 3: no emoji or stock pictographs in on-screen text.
// Rule 6: square corners by default. Only things that are round in the real world stay round:
//         message bubbles, voice notes, avatars, status dots and data-point dots.
export function styleGuard(rootSel) {
  const ROUND_OK = '.bubble, .bubble *, .vbubble, .voice, .voice *, .av, .dot, .st, .tl .dot, svg, svg *';
  const root = document.querySelector(rootSel) || document.body;
  const problems = [];
  const name = (el) => `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : ''}`;
  const pict = /\p{Extended_Pictographic}/u;
  for (const el of [root, ...root.querySelectorAll('*')]) {
    const cs = getComputedStyle(el);
    if (cs.fontStyle !== 'normal' && el.textContent.trim()) problems.push(`rule 2 (italic): ${name(el)} is ${cs.fontStyle}`);
    const r = [cs.borderTopLeftRadius, cs.borderTopRightRadius, cs.borderBottomLeftRadius, cs.borderBottomRightRadius];
    if (r.some((x) => parseFloat(x) > 0) && !el.matches(ROUND_OK)) problems.push(`rule 6 (rounded corners): ${name(el)} has border-radius ${r.join(' ')}`);
    for (const n of el.childNodes) if (n.nodeType === 3 && pict.test(n.textContent)) problems.push(`rule 3 (emoji): "${n.textContent.trim().slice(0, 40)}" in ${name(el)}`);
  }
  return [...new Set(problems)].slice(0, 12);
}
