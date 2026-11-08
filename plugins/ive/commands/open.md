---
description: Open Ive's editor of the person kit on the kit pulled into this folder.
argument-hint: "[folder]"
allowed-tools: Bash(node:*)
---

Open Ive's editor on the person kit in this folder (or in the folder given: $ARGUMENTS): the same template pages as Ive online, in Preview and Design, with the canvas.

1. If there is no `kit.json` there, say so and offer `/ive:pull` first.
2. Run, in the background so it keeps serving:

   `node "${CLAUDE_PLUGIN_ROOT}/skills/ive/open.mjs" <folder>`

   It serves the editor from the plugin and the kit's files from the folder, on this computer only, and opens it in the browser. Where `CLAUDE_PLUGIN_ROOT` is not set, the script is `skills/ive/open.mjs` in the folder this plugin is installed in. It asks nothing of Ive.
3. Give the person the address it prints. Save in the editor writes the template into `kit.json` in the folder, and nothing else; `/ive:save` sends it to Ive.
4. To measure ink on the grid, or where this plugin was built without the editor, `--playground` (or the plugin itself) opens the toolkit's playground; `window.toolkit.results` and `window.toolkit.shortened` on it hold what was measured and shortened, as the ive skill's `references/brand-toolkit.md` says under "Check it".
