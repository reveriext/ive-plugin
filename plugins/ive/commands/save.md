---
description: Save a changed part of the person kit back to Ive, with the revision it was read at.
argument-hint: "[card | banners | signatures]"
---

Save the person kit in this folder back to Ive, as the ive skill's `references/brand-toolkit.md` says under "Save it". Read that guide first; this is a summary of it.

Arguments: $ARGUMENTS names the part to save (`card`, `banners` or `signatures`). With none, find which parts of `kit.json` differ from what Ive has and ask which to save. The editor's Save (`/ive:open`) writes `kit.json`; this is what sends it to Ive.

1. Read `ive.json` for the organisation and the revision the kit was read at. Without it, say the kit was not pulled with `/ive:pull` and stop.
2. `get_person_kit` again and show the person, part by part, what would change. Save only what they ask for: it is everybody's at once.
3. `save_person_kit` with the part, the whole of that part from `kit.json` and the revision from `ive.json`. A designer's save waits for an admin; say so when it does.
4. If it is refused because Ive changed since, read again, put the change on what is there now, show it again, and ask before saving.
5. Read it back with `get_person_kit`, compare, and write the new revision into `ive.json`.
