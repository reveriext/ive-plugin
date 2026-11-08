---
description: Take the organisation's person kit, its brand, tokens and fonts, and your own details from Ive into this folder.
argument-hint: "[organisation] [brand kit]"
---

Pull the person kit from Ive into the current folder, as the ive skill's `references/brand-toolkit.md` says under "Set it up". Read that guide first; this is a summary of it.

Arguments: $ARGUMENTS. The first, if given, is the organisation; the second the brand kit the work is for (the company's when none is given). Where the person belongs to more than one organisation and none is given, ask which.

1. `get_person_kit`: write its `card`, `banners` and `signatures` as `kit.json`.
2. `get_brand_kit` for the kit: write `brand.json` as the skill describes, with local copies of the logos and marks fetched through `link_to_file`.
3. `get_design_tokens` with format `css`, and the font files found with `list_assets` or `search_files` and fetched through `link_to_file`: write `brand.css` with the tokens and the `@font-face` rules, the fonts beside it.
4. `get_my_kit`: write `people.json` as a list holding the person's own details. Ive gives nobody else's.
5. Write `ive.json`: `{ "organisation", "kit", "revision", "pulledAt" }`, the revision being the one `get_person_kit` gave.

Do not copy the skill's `playground/` or the plugin's editor here. Say what was written, and that `/ive:open` opens the editor on it.
