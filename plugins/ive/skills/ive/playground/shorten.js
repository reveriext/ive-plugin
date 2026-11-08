// How Ive reads a person's details and shortens them to what a template takes, copied from
// packages/core/src/profile.ts (bare, linkedinId, titleLines, KIT_INPUT_LABELS,
// KIT_INPUT_RULES, shortenName, shortenTitle, inputLength and shortenFor) so a piece laid out
// here is laid out from the details Ive lays it out from. packages/tenant/test/toolkit.test.ts
// fails if the two part.
//
// A template's `inputs` name the details it takes, each with a character limit and a rule for a
// longer value. Before a piece is laid out its details are shortened by those rules; what was
// shortened is said in `shortened`, and a detail that is never shortened (an email, a LinkedIn
// handle, phones that are refused) is kept whole and said in `refused`, since Ive refuses it
// where a team member writes it.

export const bare = (address) =>
  address
    .replace(/^https?:\/\//i, '')
    .replace(/^www\./i, '')
    .replace(/\/$/, '');

export const linkedinId = (address) =>
  bare(address.trim())
    .replace(/^(?:[a-z]{2,3}\.)?linkedin\.com\//i, '')
    .replace(/^(?:in|company|pub|school)\//i, '')
    .replace(/[?#].*$/, '')
    .replace(/\/+$/, '');

export const titleLines = (title) =>
  title
    .split(/\s+·\s+|\s*\|\s*|\s*\n\s*/)
    .map((part) => part.trim())
    .filter(Boolean);

/** What each input is called, as Ive names it where it is set and where it is written. */
export const KIT_INPUT_LABELS = {
  name: 'Full name',
  title: 'Job title',
  email: 'Email',
  phones: 'Phone numbers',
  linkedin: 'LinkedIn handle',
  location: 'Location',
};

/** The rules each input may have, its usual one first. An address is never shortened. */
export const KIT_INPUT_RULES = {
  name: ['initial', 'cut'],
  title: ['word', 'line'],
  email: ['refuse'],
  phones: ['second', 'refuse'],
  linkedin: ['refuse'],
  location: ['word', 'cut'],
};

/** An input as Ive reads it: no limit is 0, and no rule (or one the detail may not have) its usual one. */
const inputOf = (input) => ({
  field: input.field,
  limit: Number(input.limit) || 0,
  shorten: KIT_INPUT_RULES[input.field]?.includes(input.shorten)
    ? input.shorten
    : (KIT_INPUT_RULES[input.field]?.[0] ?? 'refuse'),
});

const text = (value) => String(value ?? '');
const chars = (value) => [...value].length;
/** Cut a character at a time, as a person counts them, never inside one. */
export const cutAt = (value, most) => [...value].slice(0, most).join('').trimEnd();
/** Words that do not end a title: "Head of" is not a title. */
const LEFT_HANGING = /(?:\s+(?:and|of|for|the|at|in|to|&))+$/i;
/** Separators that do not end a title either: "Head of Partnerships ·". */
const TRAILING = /[\s·|,;:–—/&-]+$/;

/** A line cut at the last whole word that is within `most`; a first word longer than it is cut. */
function wholeWords(value, most) {
  const line = value.trim().replace(/\s+/g, ' ');
  if (chars(line) <= most) return line;
  const head = [...line].slice(0, most + 1).join('');
  const at = head.lastIndexOf(' ');
  let kept = at > 0 ? head.slice(0, at) : cutAt(line, most);
  for (let pass = 0; pass < 4; pass += 1) {
    const next = kept.replace(TRAILING, '').replace(LEFT_HANGING, '');
    if (next === kept) break;
    kept = next;
  }
  return kept || cutAt(line, most);
}

/** A full name within `most`: the first name to its initial, then the middle names left out, then cut. */
export function shortenName(name, most, rule = 'initial') {
  const whole = name.trim().replace(/\s+/g, ' ');
  if (!most || chars(whole) <= most) return whole;
  const parts = whole.split(' ');
  if (rule === 'initial' && parts.length > 1) {
    const initial = `${[...(parts[0] ?? '')][0] ?? ''}.`;
    const first = [initial, ...parts.slice(1)].join(' ');
    if (chars(first) <= most) return first;
    const both = `${initial} ${parts[parts.length - 1]}`;
    return chars(both) <= most ? both : cutAt(both, most);
  }
  return cutAt(whole, most);
}

/** A job title within `most`: its whole lines that are within it (with `line`, only its first), or its first line cut at a word. */
export function shortenTitle(title, most, rule = 'word') {
  const whole = title.trim();
  if (!most || chars(whole) <= most) return whole;
  const lines = titleLines(whole);
  let kept = '';
  let from = 0;
  for (const part of rule === 'line' ? lines.slice(0, 1) : lines) {
    const end = whole.indexOf(part, from) + part.length;
    if (chars(whole.slice(0, end)) > most) break;
    kept = whole.slice(0, end);
    from = end;
  }
  return kept || wholeWords(lines[0] ?? whole, most);
}

/** How long the phones are on their one line: both numbers, as "a | b". */
export const phonesLength = (person) =>
  chars([text(person.phone).trim(), text(person.phone2).trim()].filter(Boolean).join(' | '));

/** How many characters a detail is as its input counts it: trimmed, LinkedIn as its handle. */
export function inputLength(field, person) {
  if (field === 'phones') return phonesLength(person);
  if (field === 'linkedin') return chars(linkedinId(text(person.linkedin)));
  return chars(text(person[field]).trim());
}

/**
 * A person's details as a template takes them (`inputs`): each longer than its limit shortened
 * by its rule, what was shortened in `shortened` ({ field, was, now }) and what is never
 * shortened but is longer than the template takes in `refused`.
 */
export function shortenFor(person, inputs) {
  const now = { ...person };
  const shortened = [];
  const refused = [];
  for (const input of (inputs ?? []).map(inputOf)) {
    if (!input.limit || inputLength(input.field, now) <= input.limit) continue;
    const { field, limit, shorten } = input;
    if (shorten === 'refuse') {
      refused.push(field);
      continue;
    }
    if (field === 'phones') {
      const was = [now.phone, now.phone2].filter(Boolean).join(' | ');
      now.phone2 = '';
      now.phone2Label = '';
      if (chars(text(now.phone).trim()) > limit) refused.push(field);
      shortened.push({ field, was, now: now.phone });
      continue;
    }
    if (field !== 'name' && field !== 'title' && field !== 'location') continue;
    const was = text(now[field]);
    now[field] =
      field === 'name'
        ? shortenName(was, limit, shorten)
        : field === 'title'
          ? shortenTitle(was, limit, shorten)
          : shorten === 'cut'
            ? cutAt(was.trim(), limit)
            : wholeWords(was, limit);
    shortened.push({ field, was, now: now[field] });
  }
  return { person: now, shortened, refused };
}

/** What is said under a piece: each detail shortened, and each that would be refused. */
export function saidOfShortening({ shortened = [], refused = [] }) {
  return [
    ...shortened.map(
      (s) =>
        `${KIT_INPUT_LABELS[s.field]} shortened by the template’s rule: “${s.was}” → “${s.now}”`,
    ),
    ...refused.map(
      (field) =>
        `${KIT_INPUT_LABELS[field]} is longer than this template takes. It is never shortened, and a team member’s is refused where they write it.`,
    ),
  ];
}
