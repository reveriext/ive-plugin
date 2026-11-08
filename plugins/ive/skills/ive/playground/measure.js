// Where the ink of a laid-out piece lands on its grid. A piece's grid is N blocks across its
// width (and the same blocks down); a position is on the grid when it is a whole or half number
// of blocks, within a tolerance. Text is measured by its ink, not its box: the top of its
// capitals, its baseline and where its first letter's ink starts. A picture or a box is
// measured by its edges, and is on the grid when, across and down, either its edges or its
// centre are. A screen rounds to pixels, so measure a copy laid out large: `zoom` is the CSS
// zoom of the page measured (its boxes are zoomed, its computed font sizes are not).

const TOLERANCE = 0.02;
/** How far a round first letter (C, O) may sit past the margin, by design. */
const OVERSHOOT = 0.1;

/** How far a value is from the nearest half block. */
const off = (value) => Math.abs(value * 2 - Math.round(value * 2)) / 2;
const round = (value) => Math.round(value * 1000) / 1000;

/** The text an element holds itself, not through its children. */
const ownText = (el) =>
  [...el.childNodes]
    .filter((node) => node.nodeType === 3)
    .map((node) => node.textContent)
    .join('')
    .trim();

/**
 * The lines an element's own text is laid out in, found letter by letter: each line's words,
 * its first and last letters, where the first starts and where the last does.
 */
function linesIn(el, doc) {
  const lines = [];
  const range = doc.createRange();
  for (const node of el.childNodes) {
    if (node.nodeType !== 3) continue;
    for (let i = 0; i < node.length; i += 1) {
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getBoundingClientRect();
      if (!rect.width && !rect.height) continue;
      const letter = node.data[i];
      let line = lines.find((l) => Math.abs(l.top - rect.top) < rect.height / 2);
      if (!line) {
        line = { top: rect.top, text: '', first: '', final: '', left: 0, lastLeft: 0 };
        lines.push(line);
      }
      line.text += letter;
      if (!/\s/.test(letter)) {
        if (!line.first) {
          line.first = letter;
          line.left = rect.left;
        }
        line.final = letter;
        line.lastLeft = rect.left;
      }
    }
  }
  return lines.filter((line) => line.first).sort((a, b) => a.top - b.top);
}

const label = (el) =>
  el.tagName.toLowerCase() + (el.classList.length ? `.${[...el.classList].join('.')}` : '');

/**
 * Every line of text and every picture or filled box in `root`, measured in blocks of
 * `root`'s width / `grid`. Each says whether its edges are on the grid.
 */
export function measure(root, grid, zoom = 1) {
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const frame = root.getBoundingClientRect();
  const block = frame.width / grid;
  const at = (px, from) => round((px - from) / block);
  const ctx = doc.createElement('canvas').getContext('2d');
  const found = [];

  for (const el of root.querySelectorAll('*')) {
    const style = win.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    const box = el.getBoundingClientRect();
    if (!box.width && !box.height) continue;
    const text = ownText(el);
    if (text) {
      ctx.font = `${style.fontStyle} ${style.fontWeight} ${Number.parseFloat(style.fontSize) * zoom}px ${style.fontFamily}`;
      const cap = ctx.measureText('H').actualBoundingBoxAscent;
      // The baseline of the element's last line, from a mark set on it.
      const probe = doc.createElement('span');
      probe.style.cssText = 'display:inline-block;width:0;height:0;vertical-align:baseline';
      el.append(probe);
      const last = probe.getBoundingClientRect().top;
      probe.remove();
      const lines = linesIn(el, doc);
      const height = Number.parseFloat(style.lineHeight) * zoom || box.height / lines.length;
      const font = `${style.fontFamily.split(',')[0].replace(/"/g, '')} ${style.fontWeight}`;
      lines.forEach((line, k) => {
        const baseline = last - (lines.length - 1 - k) * height;
        const words = line.text.trim();
        const item = {
          what: label(el),
          kind: 'text',
          text:
            (words.length > 28 ? `${words.slice(0, 27)}…` : words) +
            (lines.length > 1 ? ` (line ${k + 1} of ${lines.length})` : ''),
          font,
          lines: lines.length,
          capTop: at(baseline - cap, frame.top),
          baseline: at(baseline, frame.top),
          inkLeft: at(line.left - ctx.measureText(line.first).actualBoundingBoxLeft, frame.left),
          right: at(line.lastLeft + ctx.measureText(line.final).actualBoundingBoxRight, frame.left),
        };
        // A first letter's own side bearing differs from letter to letter, so its ink may sit a
        // little either side of the line it starts on.
        item.onGrid =
          off(item.capTop) <= TOLERANCE &&
          off(item.baseline) <= TOLERANCE &&
          off(item.inkLeft) <= OVERSHOOT;
        found.push(item);
      });
      continue;
    }
    const filled =
      el.tagName === 'IMG' ||
      el.tagName === 'svg' ||
      (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent');
    if (!filled) continue;
    const item = {
      what: label(el),
      kind: 'box',
      left: at(box.left, frame.left),
      top: at(box.top, frame.top),
      right: at(box.right, frame.left),
      bottom: at(box.bottom, frame.top),
    };
    const fits = (a, b) =>
      (off(a) <= TOLERANCE && off(b) <= TOLERANCE) || off((a + b) / 2) <= TOLERANCE;
    item.onGrid = fits(item.left, item.right) && fits(item.top, item.bottom);
    found.push(item);
  }
  return found;
}

/** What `measure` found that runs past the margin, in blocks, on any side. */
export function pastMargin(found, grid, margin) {
  const low = margin - OVERSHOOT;
  const high = grid - margin + TOLERANCE;
  return found.filter((item) =>
    item.kind === 'text'
      ? item.inkLeft < low || item.right > high || item.capTop < low || item.baseline > high
      : false,
  );
}

/** How many lines an element takes: its height over its line height. */
export function linesOf(el, zoom = 1) {
  const style = el.ownerDocument.defaultView.getComputedStyle(el);
  const height = Number.parseFloat(style.lineHeight) * zoom;
  return height ? Math.round(el.getBoundingClientRect().height / height) : 1;
}
