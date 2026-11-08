# Ive 0.22.0

The Ive plugin for Claude Code. Work on the person kit in your own project with Claude Code: Ive’s skill, Ive’s own editor, the connector and three commands (/ive:pull, /ive:open, /ive:save). It holds nothing of your organisation; the kit is pulled in when you work.

- Connector: https://hyive.app/mcp (the first time a tool is used, Claude Code asks you to sign
  in to Ive; there is no key)
- Commands: `/ive:open` Open Ive's editor of the person kit on the kit pulled into this folder.
  `/ive:pull` Take the organisation's person kit, its brand, tokens and fonts, and your own details from Ive into this folder.
  `/ive:save` Save a changed part of the person kit back to Ive, with the revision it was read at.
- Skills: ive
- Editor: Ive's own editor of the person kit, in `editor/`, which `/ive:open` opens on
  the kit pulled into a folder, on this computer only; its Save writes `kit.json` there, and
  `/ive:save` sends it to Ive

Install it from Ive's marketplace, which keeps it up to date:

    /plugin marketplace add https://hyive.app/plugin
    /plugin install ive@ive
