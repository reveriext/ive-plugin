<!--
Sources, in the Ive repository:
- packages/tenant/src/mcp.ts (find_collateral, get_record, save_my_copy, share_my_copy, ask_for_company, decide_ask, get_material_file, upload_links, add_file, save_record, get_shapes, check_record)
- packages/tenant/src/ownfiles.ts (a person's own files for Personal, moved when copied in)
- packages/core/src/pdfbeside.ts (which file carries a PDF beside it)
- packages/core/src/doc-template.ts, doc-checks.ts (the shape of an issue's content and its checks)
- packages/core/src/records.ts (collateralSpec, COLLATERAL_USES, COLLATERAL_ASKS, owedAsks, reviewData.unapproved)
- packages/core/src/catalogue.ts, variant-type.ts (the variant types, their sizes and file formats; a variant's type and size)
- packages/tenant/src/render.ts (what holds a finished file back)
- docs/architecture.md (collateral, its variants, a version of your own)
-->

# Collateral

## Find it before you write it

What the team has approved is what should go out. Ask first, draft last.

1. **Ask what it is for** if you were not told: who it is for, and the occasion.
2. **`find_collateral`** with that audience, moment, type or a few words. It answers with each
   collateral that fits, how it may be used, and the id of every variant it comes in.
3. **Nothing fits?** Say so. Only then offer to draft one as the person's own.

## Ask what to make it with, before you make it

Every variant is a **variant type** of Ive's one catalogue at one of that type's **sizes**: a
Booklet at 8.5 in square, a Post at Portrait 1080 × 1350, a Document at A4. `get_shapes` with
kind `catalogue` lists the types this organisation shows, by category, each with its sizes (the
organisation's paper first), the file formats it gives and the templates there are of it.
`find_collateral` with `variant_type` finds what is made of one ("flyer"; "LinkedIn post" is a
Post).

Before you create anything (a collateral, a variant, a version of one, a piece of the kit), ask
the person once, in one question, what it is and what it should be made with:

- **Type and size**: which variant type, at which of its sizes. Offer the types shown, each with
  its sizes, and a template of it where there is one. Asked for "a LinkedIn post", offer Post
  and its sizes (Landscape 1200 × 627, Square 1080 × 1080, Portrait 1080 × 1350); a newsletter is
  a Booklet, and its LinkedIn article an Article.
- **Images**: which pictures, if any: from the brand's collections (`get_collections`), or none.
- **Assets**: the brand's own logos, icons and glyphs from the library (`list_assets`), or none.
- **Template**: which template it is laid out on; offer the ones there are of that type and
  size, by their names (`list_records`, kind `template`), and say which suits the occasion. A
  template is the organisation's own design for one type, made by its brand designer: where
  there is none of that type and size, say so rather than make one on another type's.
- **Content only**: just the words, laid out on the template's defaults, nothing else added.

Then make it as they said. Do not choose a type, a size, pictures, assets or a template for them
unasked. Save the variant with `data.type` and `data.size` by id, `data.format` the template's id
(`data.template` is taken as the same) and, where the person names it, `data.name`, its own short
name. Left out, the type and size are the template's. A save at a size the template is not laid
out at, of another type than its template's, or of a type the organisation hides, is refused,
naming the sizes there are: ask again rather than choose another. A version of a team variant
keeps its master's type and size.

## How a collateral may be used

| It says | What you do |
|---|---|
| **ready** | Give it as it is: `get_material_file` with the variant's id. Do not make a version of it. |
| **asks** | It names what it needs (who it is for, the date, who is presenting). Get the answers from the person, then `save_my_copy` with `based_on` and only those answers. Nothing else in it changes. |
| **tailor** | As above, and the person may also choose which sections to keep and write the opening line. Keep the team's wording in the sections you keep. |

A collateral that asks gives **no finished file** until every answer is in a version of the
person's own. The refusal says what is missing; ask for exactly that.

The organisation holds every connection to this, as it holds the person in the app: a version of
one that is **ready** is refused, and so is a version of one that **asks** that changes anything
but `customer`, `date` and `contact`. Do not look for a way round it.

## What you make is theirs

- `save_my_copy` makes a version that belongs to the person you act for. The team's master is
  never touched.
- An admin can open every version a person makes. Say so if it matters to them.
- A draft made from nothing the team approved may be held by the organisation until an admin
  makes it the team's. If a finished file is refused for that reason, tell the person to share
  it with an admin; do not look for a way round it.

## Images

A picture for a collateral or for a person's kit (a social post, a banner) is made outside
Ive, in whatever tool makes pictures, and then kept here: `list_image_sizes` for the sizes
this organisation uses, then `store_image` with the size it was made for.

### A piece of a person's own, and making it the company's

- A version a person makes is theirs. **`share_my_copy`** says who else may open it: nobody,
  everybody, or the people named. Sharing shows it; it does not make it the company's.
- When a piece should become the company's, the person asks: **`ask_for_company`**, as a new
  collateral or as a variant of one there is, with a line on why. It then waits for an admin.
- An admin's own assistant is told what waits with **`decide_ask`**, reads the piece with
  `look`, and copies it in or declines with a reason, only when the admin asks for that. A
  copy lands in draft, as the company's own record: it is then shaped and approved like any
  other, and placed in a folder with `move_to_folder`.
- An admin making something for the company does not go this way: they save it as the
  company's from the start (`save_collateral`, then a variant with `save_record`).
- A variant can be a file the team made elsewhere, used as it is. An HTML document (a
  newsletter, a brochure laid out in HTML) is sent as one ZIP: the .html file and the files it
  names. An admin's assistant sends it with **`upload_links`** (`collateral`, one link per file)
  and then saves the variant with **`save_record`**, kind material, `data.format` "html" and
  `data.file.asset` the ZIP's id. Ive shows it page by page, runs no script in it, and exports
  it as a PDF, as PNGs and as one HTML file.
- A PowerPoint, Keynote, Word or Excel file can carry the **PDF made from it**, kept on the
  same variant (`data.pdf`): Ive shows and presents the PDF in the file's place, and exports
  both. Add the two together: one link each from **`upload_links`**, then **`save_record`**
  with `data.file.asset` the file's id and `data.pdf.asset` the PDF's. A new file clears the
  PDF unless a new PDF is given with it. A PDF, a picture or an HTML document carries none.
  **`get_material_file`** hands over the file and, where there is one, its PDF.
- Any variant Ive lays out (a document, a deck, an HTML document, an issue made from a
  template, an article) can carry a **PDF version** uploaded for it: one link from
  **`upload_links`** with `collateral`, then **`save_record`** with `data.pdf.asset` its id. It is
  then the variant's only PDF: Export gives it and Ive makes none. Saving without `data.pdf`
  takes it away, and Ive makes the PDF again.

## A file of the person's own

A person given GTM may keep files of their own in Personal: a deck they made elsewhere, the
PDF made from it, a document, an HTML document as a ZIP. Only where their organisation lets
assistants keep their own things.

1. Keep the file as theirs: **`upload_links`** with `personal` true (one link per file, up to
   50 MB), or **`add_file`** with `personal` true for a small one as base64. Give no
   collection, kit or collateral.
2. Make it a piece of their own with **`save_my_copy`**: no `based_on`, `data.story` empty,
   `data.format` "file" (or "html" for a ZIP), `data.file.asset` its id, and `data.pdf.asset`
   the PDF's id where there is one.
3. It is theirs and the admins'. **`share_my_copy`** gives it to the people they name, and
   **`ask_for_company`** offers it to an admin. Copied in, the file is moved to the company,
   not copied: their piece goes on naming it.

## Writing an issue

A newsletter, a report or any piece made from a template kept whole is written as content, not
as markup. Its content is the company's: an admin writes and changes it, signed in or through
their own connection made to write; everybody given GTM reads, presents and exports it.

A newsletter is a **Booklet** (at 8.5 in square, where its template is laid out so), made from
the organisation's own template, which may be called "Newsletter"; its LinkedIn article is an
**Article** (at Cover 1920 × 1080), made from an article template, also called "Newsletter". Ask
which type and size, and which template, as above, before you make either.

1. **Read the shape.** `get_shapes` with `template` (the variant's `data.format`) names the
   template's type and size, and gives the content's shape as JSON Schema: what the issue says
   once, the page types and the blocks, with their fields.
2. **Fill it.** `data.content` is `{ issue, references, pages }`. Each page is a page type's id
   and its fields; a body or a visual is a list of blocks, each a block's id and its fields. Copy
   is plain text with `**bold**`; cite with `[^key]` or `[^key-a,key-b]`, or a `cite` list, from
   the keys in `references`. Never type a number for a citation or a page: Ive numbers them.
   Pictures are the organisation's own files (`file`, the address of a file of theirs, with `alt`, `focus` and `concept`),
   put in first with `upload_links`; a concept picture says so in its alt text. Colours are
   token names; icons and glyphs are elements by folder and name.
3. **Check.** `check_record` with kind `material` runs the checks that need no layout and says
   each problem with its path (`pages.3.visual.0.groups.1.max: a number`). Errors hold the PDFs;
   warnings are listed. The checks that need it laid out (text inside the safe area, nothing past
   a page's area, pictures sharp enough to print, fonts) are made in the app.
4. **Save.** `save_record` with kind `material`, the content and the revision you read, and for
   a new variant `data.type` and `data.size` (the template's, as `get_shapes` named them) and
   its `data.name` ("Booklet"). A save that does not fit its template is refused, saying where.
5. **Hand it over.** `get_material_file` gives the print PDF (bleed, crop marks, trim and bleed
   boxes), the screen PDF and one HTML file, each by a link.

### An article from the same issue

A LinkedIn article (or any article) is a second variant of the same collateral: an Article at
Cover 1920 × 1080, named "LinkedIn article" (`data.name`), made from a template whose form
factor is an article. It keeps no pages of its own: `data.contentFrom` names
the variant whose content it writes from (the booklet's slug), so a change to the issue changes
both. Its own `data.content` is `{ issue: { … } }` with only what the article template declares
(its title or its cover where they differ from the issue's). Save it with `save_record`, kind
`material`; one that writes from a variant that is not the company's, or not made from the
template the article is from, is refused.

`get_material_file` gives an article as its words in Markdown, a marker paragraph where each
picture goes ("[Image 2 of 5: Flex share of leasing]"), and links to the article as one HTML
file, its cover and each picture, each drawn at its size; `inline` true gives the article as
the HTML the app copies. The person publishes it by pasting the article into the editor
(in the app, Export › Rich Text copies it), putting each picture in at its marker,
and giving the editor the cover (exported in the app as a JPG or PNG under 5 MB).
