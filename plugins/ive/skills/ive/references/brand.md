<!--
Sources, in the Ive repository:
- packages/tenant/src/mcp.ts (list_brand_kits, get_brand_kit, get_collections, get_design_system, get_design_tokens, list_records with kind guideline or component, list_assets, search_files, see_file, show_files, link_to_file, change_file, change_files, add_file, upload_links, replace_file, get_person_kit, save_person_kit, list_image_sizes, save_mark, get_usually_kept, set_not_for_us, save_record with kind kit)
- packages/core/src/marks.ts (a mark's forms, its role, its rules as numbers)
- packages/core/src/kits.ts (a kit that stands alone, NEUTRAL_TOKENS)
- packages/core/src/tokens.ts (how tokens compile, the contrast checks)
- docs/context-layer.md (DESIGN.md, the DTCG token file, the stylesheets)
-->

# Working in the brand

## Which brand kit

An organisation may keep more than one brand kit: the company's, and others that start from it
for a business unit, a product or an event, each keeping only what differs.

- **`list_brand_kits`** says which there are. **`get_brand_kit`** outlines one, with what it
  starts from filled in; name `parts` (rules, tokens, components, collections, or `all`) to
  have those whole.
- A tool that takes `kit` means the company's when none is given, so name the kit the work is
  for.
- A kit may **start from nothing: a brand of its own** (a partner's, another owner's). It takes
  nothing from the company's kit, so nothing of the company's (its name, logos, colours, type,
  rules or files) belongs in work for it. What it has not given yet is Ive's neutral defaults:
  ask for the partner's own rather than borrowing the company's.
- Whether a kit stands alone is `data.standsAlone` on its record (`kit/<slug>`), saved with
  **`save_record`** like any change to a kit: it waits to be published, and a kit that stands
  alone keeps no parent.

## Use the tokens by name

- **`get_design_system`** is the whole system in one document: the tokens and the rules.
  Read it once at the start of any design work.
- **`get_design_tokens`** gives the values. Use a token by its **name**, never a copied value:
  the organisation changes a value in one place and everything follows.
- A colour pair the organisation has checked for contrast is safe to put text on. Do not
  invent a pair.

## The logo

- A kit names its marks by **role**: one **primary logo**, a logo mark, lockups, an app icon.
  Use the primary logo unless the place asks for another; its form for the ground it stands
  on (the one drawn for dark on a dark ground). The kit's documents already carry it.
- A mark may have **rules as numbers**: the clear space kept on every side, in capital heights,
  and the smallest it may go on a screen (pixels across) and in print (millimetres across),
  with the mark to use below that. Keep to them, and say so where a layout cannot.
  `get_design_system` and the guidelines state them.
- A designer's or an admin's own connection says what a mark is with **`save_mark`**: by its
  folder and stem, its role, and its numbers. It is a change to the brand, so it waits like
  any other: in the kit's changes for an admin's, for an admin's approval for a designer's.

## What a kit usually keeps

- **`get_usually_kept`** with place `kit` says what most brand kits keep (the logo and its
  forms, type, colour, imagery, icons and patterns, social templates and channel pictures,
  the person kit, mockups and merchandise) and how this kit stands. A kit that starts from
  another is asked only for what it might add; a kit that stands alone is asked for everything. Offer to fill what is missing, one thing at a
  time; **`set_not_for_us`** sets aside what the person says is not for them. Through a
  designer's connection it waits for an admin, as their every change to the brand does, and
  only one change to a thing waits at a time; through an admin's own it is in use at once.

## The rules are written down

- **`list_records` with kind `guideline`** are the written rules: voice, logo, colour,
  imagery, wording the organisation does not use. Read the one that applies before you write
  or lay anything out.
- **`list_records` with kind `component`** are the parts it has already drawn. Use one before
  drawing another.

## Pictures and films

- **`get_collections`** gives the collections the brand keeps its pictures, films and
  illustrations in, each with its story: what it is for, where to use it and where not, and
  the brief for making more like it.
- Ive makes no picture. Make one outside Ive from the collection's brief, then keep it here.
- A collection of the sort `channels` holds the pictures of each official profile, at the
  sizes each place asks for (`list_image_sizes`). One of the sort `merch` is what is made with
  the brand on it: each item says where the brand is placed, in which colours and how it is
  printed, kept where a picture keeps the seed, the model and the tool it was made with.

## Files

- **`list_assets`** lists logos, icons, imagery and fonts, each with when to use it, any rights
  on it and the day its use ends. A file whose use has ended is not to be used; one with terms
  needs a person to accept them.
- **`search_files`** finds a file by its name, its tags or, for a document, what it says.
- To add real files (pictures, films, PDFs), do not write their bytes into a call.
  **`upload_links`** gives a link for each file of a set, to the collection or folder they go
  in, with what you know of each; send each file's bytes to its link as the body of a POST.
  For a picture another tool made and gave you an address for, **`add_file`** with `url`
  fetches it. Say what each file is, tag it, and say how it was made (`change_file`, origin).
- To give a file new bytes in place (a sharper logo, a corrected PDF), keep its id: it keeps
  its address, so everything that names it follows, and the bytes it had are kept as an
  earlier version. **`replace_file`** takes a small file as base64; for a real file you hold,
  **`upload_links`** with `replace` (the file's id) gives one link to send the new bytes to,
  with a `note` on what changed. An admin's connection replaces any file of the team's; a
  designer's, a file it added that still waits for an admin.
- To put the library in order, **`change_file`** moves one file to a collection or a folder
  (`folder`), and sets its tags, when to use it and how it was made; **`change_files`** does
  the same move, or adds tags, for many files at once. A file keeps its id and its address
  wherever it is moved, so nothing that names it breaks. Give every picture tags it would be
  looked for by: `search_files` finds by them.
- The person kit (everybody's visiting card, ID card, banners and email signatures) is made
  from templates the brand keeps. **`get_person_kit`** gives them with the places a template
  may use; **`save_person_kit`** keeps one of them, for an admin or a brand designer. A
  template is markup and a stylesheet with places such as `{{name}}`; it runs no script and
  fetches nothing. Read it, show the person what you will keep, and send the whole template
  back at the revision read.
- **`see_file`** shows you a picture itself, so you can look at it before you use it.
- **`show_files`** shows the person pictures side by side: a collection's, or the ones you
  name. Use it when they ask to see pictures, or should look before something is chosen or
  changed. It shows them, not you; to list or find files, `list_assets` and `search_files`.
- **`link_to_file`** gives a link to one file that works for ten minutes without signing in.
  It is for taking a file out to make something somewhere else: to download it, or to hand to
  a tool that fetches a picture by its address. Ask for one only when you are about to use it.
- What you make and keep in Ive never carries such a link. There a file is named by its own
  address, the one `get_file` gives, which does not end: the picture then stays the approved
  one, and follows the file when it is replaced.
- **`list_image_sizes`** gives the sizes an image is made for here. Make one at exactly one of
  them.
- Use the logo made for the ground it sits on: the full-colour one on a light ground, the
  reversed one on the brand colour.
