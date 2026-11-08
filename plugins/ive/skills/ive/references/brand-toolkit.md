<!--
Sources, in the Ive repository:
- packages/tenant/src/mcp.ts (get_person_kit, save_person_kit, get_my_kit, get_brand_kit, get_design_tokens, list_assets, search_files, link_to_file, get_plugin, get_shapes, save_record, check_record, upload_links)
- packages/core/src/doc-template.ts, doc-markup.ts, fields.ts (a template kept whole, its markup with places, its fields)
- packages/document/src/lay.ts (layDocument, the helpers, the page frame)
- packages/plugin (the Ive plugin: its commands /ive:pull, /ive:open and /ive:save)
- packages/core/src/profile.ts (fill, placesOf, ownCard, kitBannerPiece, kitSignaturePiece, KIT_PLACES)
- packages/core/src/profile.ts (shortenFor, shortenName, shortenTitle, inputLength)
- playground/fill.js is a copy of that layout, and playground/shorten.js of that shortening, held to them by packages/tenant/test/toolkit.test.ts
-->

# The Brand Toolkit and the person kit

## The person kit in the catalogue

Each template of the person kit is of one variant type of Ive's catalogue, and `get_person_kit`
and `get_my_kit` say each one's type and size:

- the visiting card (`card`) is a **Business Card**, at 85 × 55 mm or 3.5 × 2 in (the
  organisation's locale's, unless the card keeps a size of its own, which is Custom);
- the ID card (`badge`) is an **ID Card**, at 54 × 86 mm;
- a banner is a **Banner**, at its platform's size (LinkedIn 1584 × 396, X 1500 × 500);
- a profile picture (`portraits`) is a **Profile Picture**, at 800 × 800 px (another size is
  Custom);
- an email signature is an **Email Signature**, up to 600 px wide.

Nothing in the kit is written to say so: the type and size are read from what each template
keeps. Lay a piece out at its size.

## What the toolkit is

A folder in the project you are working in that holds the organisation's person kit as Ive
keeps it, a page to work on it, and the way back into Ive. The page is Ive's own editor where
the Ive plugin carries it (the template pages of Ive, in Preview and Design, with the canvas),
and otherwise the skill's playground, which lays each piece out exactly as Ive does, draws
its grid and measures where the ink lands. The kit is pulled into the folder; the page is not.
It stays with the plugin or the skill and is served beside the kit, so every project works
on the same page, the one Ive releases.

Work here, then save. Nothing in the folder is in use until it is saved to Ive.

## The Ive plugin

Designers and admins work on a kit locally through the Ive plugin, which carries the skill
and the connector's address. `get_plugin` says the version and how to install it. In Claude
Code it is two commands, `/plugin marketplace add` with the address it gives, then
`/plugin install ive@ive`, and then:

- `/ive:pull` takes the kit, the brand, its tokens and fonts, and the person's own details into
  the current folder, as "Set it up" below says, and notes the revision it was read at.
- `/ive:open` opens Ive's editor on that folder: Preview and Design, layers, drag, resize,
  guides, Undo and Redo, as online. Its Save writes the template into `kit.json` and nothing
  else; it asks nothing of Ive.
- `/ive:save` saves a changed part back with the revision read, as "Save it" below says.

Another assistant is given the same skill and the editor as a plain archive with the
connector's address (the editor in `editor/` beside `skills/`). Do not copy `playground/` or
the editor into a project, with the plugin or without it.

## Set it up

1. **The templates.** `get_person_kit` gives every template with the revision it was read at.
   Write the JSON's `card`, `banners` and `signatures` as `kit.json`, and keep the revision.
2. **The brand.** `get_brand_kit` (the company's, or the kit the work is for) says how its
   documents are dressed: colours and typefaces by role, and its logos and marks. Write
   `brand.json`: `organisation`, `website`, `logo`, `logoReversed`, `mark`, `markOnLight`
   (paths to local copies), and `brand`, `brandText`, `accent`, `ground`, `text`, `muted`,
   `headingFont`, `bodyFont`, and `typeRoles`: the JSON `get_person_kit` gives under Type
   roles, as it is. Leave out what the kit does not say; the page uses Ive's own defaults for
   those, as Ive does.
3. **Tokens and fonts.** `get_design_tokens` with format `css` is the tokens and the type, as
   the templates name them (`var(--ink)`). Find the font files with `list_assets` or
   `search_files`, fetch each through `link_to_file` (an address good for ten minutes), save
   them beside the page and write their `@font-face` rules. Put the rules and the tokens in
   `brand.css`.
4. **People.** `get_my_kit` gives your own details. Write `people.json` as a list of them; add
   anybody else by their details (name, title, email, phone, phoneLabel, phone2, phone2Label,
   linkedin, location). Ive gives a connection nobody else's details, so do not look for them.
5. **Note the revision.** Write `ive.json` with the organisation, the kit the work is for and
   the revision `get_person_kit` gave, so the save can say what it was read at.
6. **Open it** on the folder: `node <the skill folder>/open.mjs <folder>` serves the editor (or,
   where the skill came without it, the playground) and everything else from the folder, on
   this computer only, and opens it in the browser (`/ive:open` does this). `--playground`
   opens the playground where the editor is there too. A page opened from disk cannot read its
   files.

The editor is Ive's own template pages: the piece in Preview with its samples, and Design with
its layers, the canvas (choose, drag, resize by the handles, snap to the margins, the centre
and the other layers, Shift or a box drawn round them for several, the arrow keys to nudge)
and Properties, Undo and Redo. Pictures come only from the brand library online, so none are
added here. Save keeps the template in `kit.json`; "Save it" below sends it to Ive.

The playground shows each card variant, banner and signature, for any of the people or for
the details typed into its form, shortened by the piece's `inputs` first, as Ive shortens
them. `window.toolkit.results` holds every face measured, and `window.toolkit.shortened` what
the piece shortened and what it would refuse, for you to read back without looking at the
screen.

## Lay it out on a grid

Precision is the point: every position is a number of grid blocks, and you check it by
measuring the result, never by eye.

- **The grid.** N blocks across the piece's width, the same blocks down. A margin of M blocks
  on every side leaves the live area; the centre is line N/2. Write every position and size in
  the stylesheet as a multiple of one block (`--f: calc(width / N)`), so the piece scales from
  its size alone.
- **Write positions from the grid, not from numbers.** Use `--kit-grid` (blocks across),
  `--kit-margin` and `--kit-block`, which Ive gives the stylesheet from the template's `grid`,
  and the template's `controls` (`--<name>`) for what a designer may move: a row a block
  starts on, a size, a capital height. Then changing the margin, or a control, moves every
  placement with it, in the playground (its Blocks, Margin and a slider for each control
  change the template itself) and in Ive.
- **Text owns whole rows.** A line of text gets a band of B rows: its `line-height` is B
  blocks and its top is on a grid line. Its capitals are B − 1 rows, so half a row is clear
  above and below every line: `font-size = (B − 1) blocks / the font's cap height`.
- **The ink lines up, not the box.** Each font is measured once: its cap height, the shift
  that centres its capitals in a band (`0.5em × (cap − ascent + descent)`), and its side
  bearing on a straight letter. Nudge each line by them (`translate: calc(-1 * side-bearing)
  shift`) so the first letter's ink sits on the margin. Measure a font in the browser with a
  canvas (`measureText('H').actualBoundingBoxAscent`, `fontBoundingBoxAscent`,
  `fontBoundingBoxDescent`, `actualBoundingBoxLeft`) and write the figures in a comment.
- **A line that may wrap flows.** Put lines that may take more than one line (a long name,
  a title) in one block that flows, each in whole bands, so a second line moves what follows
  down a band; never position them one by one. Print LinkedIn on a card as
  `{{linkedin_id}}`, the handle alone; the contact card in the code keeps the address.
- **Every detail has a limit.** Set the template's `inputs`: each detail it takes (`name`,
  `title`, `email`, `phones`, `linkedin`, `location`) with its character `limit` and its
  `shorten` rule for a longer value: a full name `initial` (first name to its initial, then
  middle names left out) or `cut`; a job title `word` (cut at the last whole word) or `line`
  (only its first line); `phones` (both on one line, "a | b") `second` (the second left off)
  or `refuse`; an email or a LinkedIn handle is always `refuse`, never shortened. Ive holds
  each detail to the smallest limit of the templates that take it where it is written, so
  set limits from the room on the piece: the longest value that sits in its rows.
- **What the canvas placed is a layer over the markup.** A card, an ID card and a banner may
  carry `placement`: the entries the designer's canvas in Ive keeps, in layer order (a later
  one is above). Each places an element of the markup by one class (`kind: "element"`,
  `element: ".name"`), a block of a brand colour (`"block"`, its `fill`), or one of the brand's
  logos (`"logo"`, `logo`: `logo`, `logo_reversed`, `mark` or `mark_on_light`), on a `face`
  (from 1) at `col` and `row`, `cols` by `rows`, all in whole or half blocks, with `align`,
  `role` (one of the brand library's type roles by key, `display-large` to `numeral`, as
  `get_person_kit` lists them under Type roles: the element takes the role's family, size,
  weight, line height and tracking, or those of the role it falls back to), `font` (`heading`,
  `body`, `mono`; set over the role's family), `band` (the type rule above; 0 is its own; set
  over the role's size) and `colour` and `fill` (`brand`, `brand-text`, `accent`, `ground`,
  `text`, `muted`). A role names the look of the words, never their heading level: which of
  `<h1>` to `<h6>` an element is stays the markup's, and a page has one `<h1>`. Its styles come
  after the template's own and win; keep an entry when you change the stylesheet, or take it
  out when the stylesheet is to place that element again.
- **Pictures keep their proportions.** A logo is sized by the width it is given and its own
  ratio, and centred in the rows it is given when it cannot fill them.
- **What the template needs beyond the details is a field.** A card, an ID card, a banner and a
  signature may declare `fields`, beside the fixed places: each with a `key` (lower case, never
  a fixed place's name), a `label`, a `type` (`text`, `long`, `date`, `choice`, `picture`),
  `required`, `max`, `options` (a choice), `pictures` (the organisation's own files a picture
  offers), a `sample` for Preview, and either nothing more (it is asked of whoever makes the
  piece, in My Kit's Fields, or with `save_my_piece`) or `from: { kind, field, page }` (filled
  from an approved Knowledge page of that sort: `title`, `summary` or a field of it; `page` a
  slug, or empty for one chosen by whoever makes the piece), with `shorten` (`word` or `cut`).
  Name it in markup as a place: `{{event}}`, `{{#event}}…{{/event}}`. Never type an event's
  name, an office's address or a registration number into the markup: it goes stale. A field
  kept from assistants, a sort of page kept inside and a page marked internal only are refused
  when the template is kept. The playground fills each field with its sample.

## Check it

- In the playground, set the piece's blocks and margin. The grid is drawn as exact lines;
  every line of text has dashed guides at its capitals and its baseline, blue on the grid and
  red off it. The table lists every line and box in blocks.
- A line is right when its capital top, baseline and first letter's ink are each on a half
  block; a wrapped line is measured line by line. Anything past the margin is said so: try a
  value at every input's limit before you save, and lower the limit where it runs past.
- Under the piece the playground says what its inputs shortened ("Full name shortened by the
  template’s rule: “Alexandra Maria Vasquez” → “A. Vasquez”") and what is longer than it takes
  and never shortened (an email, a LinkedIn handle, phones that are refused), which Ive refuses
  where a team member writes it. Try a value over every limit too: a long name, a title of two
  lines, two phones, a long email. What is shortened must still sit in its rows, and what is
  refused tells you the limit is lower than people's details.
- Look at a few sizes. A screen rounds to pixels; the measure at 5× is the truth.
- What cannot be put right in a stylesheet: a round or slanted first letter (C, O, A, V, W)
  sits a little past the margin, the more so the larger the type; a signature is held only loosely, since mail programs drop much of
  any stylesheet.

## Save it

The editor's Save writes `kit.json` in the folder, and that is all it does: nothing is in use,
or even in Ive, until it is saved through the connector.

1. Show the person what changes, part by part, before anything is saved.
2. `save_person_kit` with the part (`card`, `banners` or `signatures`), the whole of that part
   and the revision you read. It is everybody's at once: save only what the person asked for.
   It is refused when Ive changed since; read again, put your change on what is there now,
   and show it again.
3. Read it back with `get_person_kit` and compare: scripts, frames and anything that fetches
   are taken out as a template is kept.

## Limits to say plainly

- The playground lays out cards and banners exactly as Ive does. A signature is shown with its
  stylesheet; Ive writes each rule onto its element for mail programs, and its pictures must
  be on the organisation's own website, since none of Ive's files go into a signature.
- The ID card is drawn by Ive from its settings (finish, corners, band); it has no template to
  lay out here.
- A printed piece is printed from the person's browser; what you measured in one browser is
  what that browser prints.

## Porting a template

A piece made in a design tool (HTML and CSS, a little SVG) that should be filled again with new
content becomes a template Ive keeps whole: a `template` record with `data.document`. Ive lays it
out itself; nothing of the organisation's runs, so the port is markup with places, never code.

1. **Read the shape.** `get_shapes` with kind `template` says what `data.document` holds: the
   form factor (the trim in CSS px, pages in a multiple, bleed, margins, the safe area, the
   outputs and the checks), the stylesheet, the fonts, the fields, the page types and blocks.
   A template is for one variant type, at one size when it is kept whole: `data.type` and
   `data.sizes` (`get_shapes` with kind `catalogue` gives the types and their sizes), its trim
   the size's pixels and its outputs what the type gives. A newsletter's is a Booklet at 8.5 in
   square (816 × 816 px), its article's an Article at Cover 1920 × 1080; its name, `data.one`,
   is the organisation's ("Newsletter").
2. **Files by their own address.** Fonts, logos, icons and glyphs are files of the library: add
   any it lacks with `upload_links` (fonts into Fonts, SVGs into Logos, Icons or Glyphs), then
   name them, never copy them: a font as `/files/<id>` in `fonts`, an element by its folder and
   name in markup (`{{element 'logos/wordmark'}}`) or as content (`icons/building`).
3. **Each page type and block is markup with places**, in the person kit's syntax:
   `{{title}}`, `{{#items}}…{{/items}}`, `{{^note}}…{{/note}}`, and the helpers (`{{rt body}}` for
   running text with bold and citations, `{{cite cite}}`, `{{refs}}` at a page's foot,
   `{{picture image class=full slot=cover}}`, `{{blocks visual card}}`, `{{pad issue.number}}`,
   `{{token colour ink}}`). `@folio` is the page's own number and `@pages` how many there are
   (a slide's `{{@folio}} / {{pad @pages}}`): never type either.
4. **No sums in markup.** A number goes into a custom property (`style="--v: {{num value}};
   --max: {{num max}}"`) and the stylesheet does the sum (`width: calc(var(--v) / var(--max) *
   100%)`). A choice beyond "is there one" is a `choice` field and a class, or two blocks.
5. **The page frame is Ive's.** Drop the piece's own sheet, bleed and crop marks: Ive draws them
   and says the trim, bleed and margins as custom properties (`--trim-width`, `--bleed`,
   `--inner`, `--outer`, `--safe`); the document is `html.print` or `html.screen`, each page
   `.page.page--<type>` with `.is-recto` or `.is-verso`.
6. **Colours are tokens** of the kit, by name; a hex value in content is refused.
7. **Check, then save.** `check_record` before `save_record`. A designer's template waits for an
   admin, as every brand change does; an admin's joins the changes to publish. Then fill a
   sample issue and look at it in the app beside the original, page by page.
8. **An article template** writes another template's issue as an article: `form.kind`
   `article`, its size the cover's (1920 × 1080 for LinkedIn), `form.cover` its file type and
   most bytes, and `from` the template it writes from. A page type of the same id as one of that
   template's is how such a page is written, in words only (`<h2>`, `<p>`, `<blockquote>`,
   lists, `<strong>`, `<em>`); one it does not name is left out. Each block says its `article`
   form: `text` (its `articleMarkup` the words), `picture` (drawn from the issue's own markup;
   its `articleMarkup` the frame, with `{{block}}` the block and `data-label` what it shows) or
   `omit`; a block not named is a picture. `coverMarkup` lays the cover out and `titleMarkup`
   gives the title, both reading `issue`, the article's own fields as `article`, and the issue's
   first page as `page`.
