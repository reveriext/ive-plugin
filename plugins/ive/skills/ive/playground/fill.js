// How Ive fills a template of the person kit and lays out a card, an ID card or a banner an
// organisation defined, copied from packages/core/src/profile.ts (esc, colours, fill, placesOf,
// gridCss, cardVariants, ownCard, ownBadge, kitBannerPiece, and placementCss and
// placementMarkup from placement.ts) so a piece laid out here is the piece Ive
// makes. packages/tenant/test/toolkit.test.ts fails if the two part. Each piece is laid out
// from the person's details as its template's inputs take them (shorten.js), and says what it
// shortened (`shortened`) and what is longer than it takes and never shortened (`refused`).
// What this copy leaves out is Ive's sanitising (inertMarkup, inertCss): a save through the
// connector takes out scripts, frames and anything that fetches, and the save's answer says so.

import { bare, linkedinId, shortenFor, titleLines } from './shorten.js';

export { bare, linkedinId, shortenFor, titleLines };

export const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c,
  );

const css = (value, fallback) => (value && !/[;{}<>]/.test(value) ? value : fallback);

export function colours(brand) {
  return {
    brand: css(brand.brand, '#1c1c1c'),
    brandText: css(brand.brandText, '#ffffff'),
    accent: css(brand.accent, css(brand.brand, '#1c1c1c')),
    ground: css(brand.ground, '#ffffff'),
    text: css(brand.text, '#1c1c1c'),
    muted: css(brand.muted, '#6b6b6b'),
    head: css(brand.headingFont, 'Georgia, serif'),
    body: css(brand.bodyFont, 'Helvetica, Arial, sans-serif'),
  };
}

/** A template with its places filled: `{{name}}`, `{{#name}}…{{/name}}`, `{{^name}}…{{/name}}`. */
export function fill(markup, values, made) {
  const has = (key) => !!(values[key] ?? made[key]);
  let text = markup;
  for (let pass = 0; pass < 4; pass += 1) {
    const next = text.replace(
      /\{\{([#^])([a-z0-9_]+)\}\}((?:(?!\{\{[#^])[\s\S])*?)\{\{\/\2\}\}/g,
      (_whole, sign, key, inside) => ((sign === '#') === has(key) ? inside : ''),
    );
    if (next === text) break;
    text = next;
  }
  return text
    .replace(/\{\{([#^/]?)([a-z0-9_]*)\}\}/g, (_whole, sign, key) =>
      sign ? '' : (made[key] ?? esc(values[key] ?? '')),
    )
    .replace(/<img(?: class="[^"]*")? src=""[^>]*>/g, '');
}

/** A detail as a piece prints it: every gap one ordinary space, none at either end. */
export const oneSpace = (value) =>
  (value ?? '').replace(/[\s\u00a0\u1680\u2000-\u200b\u202f\u205f\u3000\ufeff]+/g, ' ').trim();

/** What is put in each place, for one person (get_my_kit's fields) in one brand. */
export function placesOf(person, brand, qr) {
  const values = {
    name: oneSpace(person.name),
    title: oneSpace(person.title),
    email: oneSpace(person.email),
    phone: oneSpace(person.phone),
    phone_label: oneSpace(person.phoneLabel),
    phone_2: oneSpace(person.phone2),
    phone_2_label: oneSpace(person.phone2Label),
    linkedin: person.linkedin ? bare(oneSpace(person.linkedin)) : '',
    linkedin_id: person.linkedin ? linkedinId(oneSpace(person.linkedin)) : '',
    location: oneSpace(person.location),
    organisation: brand.organisation ?? '',
    website: brand.website ? bare(brand.website) : '',
    logo: brand.logo ?? '',
    logo_reversed: brand.logoReversed ?? '',
    mark: brand.mark ?? '',
    mark_on_light: brand.markOnLight ?? '',
    qr: qr ?? '',
  };
  const made = {
    title_lines: titleLines(person.title ?? '')
      .map((part) => `<span class="kit-line">${esc(oneSpace(part))}</span>`)
      .join(''),
  };
  return { values, made };
}

/** A template's grid and controls, as custom properties on the piece, before its own rules. */
export function gridCss(selector, grid, controls) {
  const said = [];
  if (grid?.blocks) {
    said.push(
      `--kit-grid:${grid.blocks}`,
      `--kit-margin:${grid.margin}`,
      `--kit-block:calc(var(--kit-width) / ${grid.blocks})`,
    );
  }
  for (const control of controls ?? []) said.push(`--${control.name}:${control.value}`);
  return said.length ? `${selector}{${said.join(';')}}` : '';
}

/** What the canvas placed, as styles after the template's own (placementCss in placement.ts). */
const PLACED_CLASS = /^\.(?!kit-)[A-Za-z_][A-Za-z0-9_-]{0,63}$/;
const KINDS = ['element', 'block', 'logo'];
const LOGOS = ['logo', 'logo_reversed', 'mark', 'mark_on_light'];
const FONTS = {
  heading: 'var(--kit-heading-font)',
  body: 'var(--kit-body-font)',
  mono: 'var(--kit-mono-font, ui-monospace, SFMono-Regular, Menlo, monospace)',
};
const COLOURS = ['brand', 'brand-text', 'accent', 'ground', 'text', 'muted'];
// The brand library's type roles (PLACED_ROLES, roleSlots('type') in roles.ts), by key.
export const ROLES = [
  'display-large',
  'display',
  'display-medium',
  'display-small',
  'h1',
  'h2',
  'h2-small',
  'h3',
  'h4',
  'subtitle-large',
  'subtitle',
  'subtitle-small',
  'body-large',
  'body',
  'body-medium',
  'body-small',
  'caption',
  'label-large',
  'label',
  'label-medium',
  'label-small',
  'code',
  'quote',
  'numeral',
];
// A value of the brand's type as it is written into a style (typeValue in placement.ts).
const typeValue = (value) => {
  const said = String(value ?? '').trim();
  return said && /^[A-Za-z0-9 "',.%+\-()]{1,200}$/.test(said) && !/url\s*\(/i.test(said)
    ? said
    : '';
};
const ALIGNS = { left: 'left', centre: 'center', right: 'right' };
const placedNum = (value, most) => {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return String(Math.round(Math.min(most, Math.max(0, n)) * 1000) / 1000);
};
const usable = (p) =>
  !!p &&
  KINDS.includes(p.kind) &&
  (p.kind !== 'element' || PLACED_CLASS.test(p.element ?? '')) &&
  (p.kind !== 'logo' || LOGOS.includes(p.logo));

/**
 * `type` is the brand's type by the library's roles, by key, as get_person_kit gives it
 * (`brand.json`'s `typeRoles`): an element set in a role takes its family, size, weight, line
 * height and tracking; a `font` is set over its family and a `band` over its size.
 */
export function placementCss(side, placement, grid, type) {
  if (!grid?.blocks || !placement?.length) return '';
  const block = (n, most) => `calc(var(--kit-block) * ${placedNum(n, most)})`;
  const faces = new Set();
  const rules = [];
  placement.forEach((placed, index) => {
    if (!usable(placed)) return;
    const face = Math.min(8, Math.max(1, Math.round(Number(placed.face) || 1)));
    const on = side(face);
    if (!on) return;
    faces.add(face);
    const target = placed.kind === 'element' ? placed.element : `.kit-placed-${index + 1}`;
    const logo = placed.kind === 'logo';
    const cols = Number(placed.cols) || (logo ? 6 : 0);
    const rows = Number(placed.rows) || (logo ? 2 : 0);
    const said = [
      'position:fixed',
      'margin:0',
      'right:auto',
      'bottom:auto',
      `left:${block(placed.col, 200)}`,
      `top:${block(placed.row, 400)}`,
      `z-index:${index + 1}`,
    ];
    if (cols) said.push(`width:${block(cols, 200)}`);
    if (rows) said.push(`height:${block(rows, 400)}`);
    const fill = COLOURS.includes(placed.fill) ? placed.fill : undefined;
    if (fill) said.push(`background:var(--kit-${fill})`);
    const align = ALIGNS[placed.align];
    if (placed.kind === 'element') {
      if (align) said.push(`text-align:${align}`);
      const font = FONTS[placed.font] ? placed.font : undefined;
      const band = Number(placed.band) || 0;
      const role = ROLES.includes(placed.role) ? type?.[placed.role] : undefined;
      const family = role && !font ? typeValue(role.family) : '';
      if (font) said.push(`font-family:${FONTS[font]}`);
      else if (family) said.push(`font-family:${family}`);
      if (role) {
        const value = (property, of) => {
          const v = typeValue(of);
          if (v) said.push(`${property}:${v}`);
        };
        if (band < 1.5) value('font-size', role.fontSize);
        value('font-weight', role.fontWeight);
        if (band < 1.5) value('line-height', role.lineHeight);
        value('letter-spacing', role.letterSpacing);
      }
      if (band >= 1.5) {
        said.push(
          `font-size:calc(var(--kit-block) * ${placedNum(band - 1, 40)} / var(--kit-${font ?? 'body'}-cap, 0.7))`,
          `line-height:${block(band, 40)}`,
          'text-box:trim-both cap alphabetic',
        );
      }
      if (COLOURS.includes(placed.colour)) said.push(`color:var(--kit-${placed.colour})`);
    }
    if (logo) {
      said.push('display:block');
      if (fill) said.push('padding:calc(var(--kit-block) * 0.5)');
    }
    rules.push(`${on} ${target}{${said.map((s) => `${s} !important`).join(';')}}`);
    if (logo)
      rules.push(
        `${on} ${target} img{display:block;width:100%;height:100%;object-fit:contain;object-position:${align ?? 'center'}}`,
      );
  });
  if (!rules.length) return '';
  return [...[...faces].map((face) => `${side(face)}{contain:layout}`), ...rules].join('\n');
}

/** The blocks and logos placed on one face, put after its markup before it is filled (placementMarkup). */
export function placementMarkup(placement, face) {
  if (!placement?.length) return '';
  return placement
    .map((placed, index) => {
      if (!usable(placed) || placed.kind === 'element' || (Number(placed.face) || 1) !== face)
        return '';
      const cls = `kit-placed kit-placed-${index + 1}`;
      return placed.kind === 'logo'
        ? `<div class="${cls}"><img src="{{${placed.logo}}}" alt="{{organisation}}"></div>`
        : `<div class="${cls}"></div>`;
    })
    .join('');
}

const placed = (side, placement, grid, type) => {
  const css = placementCss(side, placement, grid, type);
  return css ? `\n${css}` : '';
};

/** The initials a person is known by where they have no photo (initialsOf). */
export const initialsOf = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

const roles = (c, width, height) =>
  `:root{--kit-brand:${c.brand};--kit-brand-text:${c.brandText};--kit-accent:${c.accent};--kit-ground:${c.ground};--kit-text:${c.text};--kit-muted:${c.muted};--kit-heading-font:${c.head};--kit-body-font:${c.body};--kit-width:${width};--kit-height:${height}}`;

/**
 * The fields a template declares, as it prints them (fieldValues in fields.ts): an asked text held
 * to its most, a choice or a picture only where it is one the field gives, a date as written, a
 * Knowledge value longer than its most shortened by the field's rule.
 */
const chars = (value) => [...value].length;
const cutAt = (value, most) => [...value].slice(0, most).join('').trimEnd();
const wholeWords = (value, most) => {
  const text = value.trim().replace(/\s+/g, ' ');
  if (chars(text) <= most) return text;
  const head = [...text].slice(0, most + 1).join('');
  const at = head.lastIndexOf(' ');
  return (at > 0 ? head.slice(0, at) : cutAt(text, most)).replace(/[\s,;:·|/-]+$/, '');
};
export function fieldValues(fields, given) {
  const values = {};
  const shortened = [];
  for (const field of fields ?? []) {
    const raw = String(given?.[field.key] ?? '').trim();
    if (!raw) {
      values[field.key] = '';
      continue;
    }
    if (field.type === 'picture') {
      values[field.key] = (field.pictures ?? []).includes(raw) ? raw : '';
      continue;
    }
    if (field.type === 'choice') {
      values[field.key] = (field.options ?? []).includes(raw) ? raw : '';
      continue;
    }
    if (field.type === 'date') {
      values[field.key] = cutAt(raw, 40);
      continue;
    }
    const most = field.max || 400;
    if (chars(raw) <= most) {
      values[field.key] = raw;
      continue;
    }
    const now = field.from
      ? field.shorten === 'cut'
        ? cutAt(raw, most)
        : wholeWords(raw, most)
      : cutAt(raw, most);
    if (field.from) shortened.push({ key: field.key, was: raw, now });
    values[field.key] = now;
  }
  return { values, shortened };
}

/** What Preview fills each field with: its sample, or the first picture or option it offers. */
export const fieldSamples = (fields) =>
  Object.fromEntries(
    (fields ?? []).map((f) => [
      f.key,
      f.sample ||
        (f.type === 'picture'
          ? (f.pictures?.[0] ?? '')
          : f.type === 'choice'
            ? (f.options?.[0] ?? '')
            : ''),
    ]),
  );

function withFields(values, template, given) {
  if (!given) return [];
  const filled = fieldValues(template.fields ?? [], given);
  Object.assign(values, filled.values);
  return filled.shortened;
}

export function cardVariants(card) {
  const count = card?.faces.length ?? 0;
  if (!count) return [];
  const named = (card?.variants ?? [])
    .map((variant, i) => ({
      name: variant.name || `Variant ${i + 1}`,
      sides: variant.sides.filter((n, at) => n <= count && variant.sides.indexOf(n) === at),
    }))
    .filter((variant) => variant.sides.length > 0);
  return named.length
    ? named
    : [{ name: '', sides: Array.from({ length: count }, (_, i) => i + 1) }];
}

/** The card an organisation defined, in one variant (its first when the name is not one of them). */
export function layCard(card, person, brand, qr = '', variant = '', given = undefined) {
  const c = colours(brand);
  // A card with no size of its own is laid out at the usual one (CARD_SIZES.us).
  const sized = card.width && card.height;
  const width = sized ? card.width : '3.5in';
  const height = sized ? card.height : '2in';
  const { person: taken, shortened, refused } = shortenFor(person, card.inputs);
  const { values, made } = placesOf(taken, brand, qr);
  const fieldsShortened = withFields(values, card, given);
  const variants = cardVariants(card);
  const sides = (variants.find((v) => v.name === variant) ?? variants[0])?.sides ?? [];
  const faces = sides.flatMap((n) => {
    const face = card.faces[n - 1];
    return face ? [{ face, n }] : [];
  });
  return {
    pages: faces.map(
      ({ face, n }) =>
        `<section class="kit-card kit-side-${n}">${fill(face.markup + placementMarkup(card.placement, n), values, made)}</section>`,
    ),
    names: faces.map(({ face, n }) => face.name || `Side ${n}`),
    width,
    height,
    shortened,
    refused,
    ...(given ? { fieldsShortened } : {}),
    css: `
${roles(c, width, height)}
.kit-card{box-sizing:border-box;position:relative;width:${width};height:${height};overflow:hidden;background:var(--kit-ground);color:var(--kit-text);font-family:var(--kit-body-font)}
.kit-card *{box-sizing:border-box}
.kit-line{display:block}
${gridCss('.kit-card', card.grid, card.controls)}
${card.css}${placed((n) => `.kit-card.kit-side-${n}`, card.placement, card.grid, brand.typeRoles)}`,
  };
}

/** A banner an organisation defined, made for one person: one page, exactly its size in pixels. */
export function layBanner(
  banner,
  person,
  brand,
  qr = '',
  picture = '',
  line = '',
  given = undefined,
) {
  const c = colours(brand);
  const width = `${banner.width}px`;
  const height = `${banner.height}px`;
  const { person: taken, shortened, refused } = shortenFor(person, banner.inputs);
  const { values, made } = placesOf(taken, brand, qr);
  const pictures = banner.pictures ?? [];
  values.picture = picture && pictures.includes(picture) ? picture : '';
  // Cut a character at a time, as the person's count of it is, never inside one.
  values.line = [...(line ?? '').trim()].slice(0, banner.line?.max ?? 0).join('');
  const fieldsShortened = withFields(values, banner, given);
  return {
    pages: [
      `<section class="kit-banner">${fill(banner.markup + placementMarkup(banner.placement, 1), values, made)}</section>`,
    ],
    names: [banner.name],
    width,
    height,
    shortened,
    refused,
    ...(given ? { fieldsShortened } : {}),
    css: `
${roles(c, width, height)}
.kit-banner{box-sizing:border-box;position:relative;width:${width};height:${height};overflow:hidden;background:var(--kit-ground);color:var(--kit-text);font-family:var(--kit-body-font)}
.kit-banner *{box-sizing:border-box}
.kit-line{display:block}
${gridCss('.kit-banner', banner.grid, banner.controls)}
${banner.css}${placed((n) => (n === 1 ? '.kit-banner' : null), banner.placement, banner.grid, brand.typeRoles)}`,
  };
}

/** The ID card an organisation designed: its own sides, at the ID card's size, 54 × 86 mm. */
export function layBadge(badge, person, brand, photo = '', given = undefined) {
  const c = colours(brand);
  const width = '54mm';
  const height = '86mm';
  const { person: taken, shortened, refused } = shortenFor(person, badge.inputs);
  const { values, made } = placesOf(taken, brand, '');
  values.photo = photo;
  values.initials = initialsOf(person.name ?? '');
  const fieldsShortened = withFields(values, badge, given);
  return {
    pages: badge.faces.map(
      (face, i) =>
        `<section class="kit-badge-side kit-side-${i + 1}">${fill(face.markup + placementMarkup(badge.placement, i + 1), values, made)}</section>`,
    ),
    names: badge.faces.map((face, i) => face.name || (i ? 'Back' : 'Front')),
    width,
    height,
    shortened,
    refused,
    ...(given ? { fieldsShortened } : {}),
    css: `
${roles(c, width, height)}
.kit-badge-side{box-sizing:border-box;position:relative;width:${width};height:${height};overflow:hidden;background:var(--kit-ground);color:var(--kit-text);font-family:var(--kit-body-font)}
.kit-badge-side *{box-sizing:border-box}
.kit-line{display:block}
${gridCss('.kit-badge-side', badge.grid, badge.controls)}
${badge.css}${placed((n) => `.kit-badge-side.kit-side-${n}`, badge.placement, badge.grid, brand.typeRoles)}`,
  };
}
