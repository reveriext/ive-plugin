# Ive 0.22.2

Ive for AI assistants: its skill and its connector, with commands and an editor for the person kit in Claude Code.

## Install

Claude Code:

    /plugin marketplace add reveriext/ive-plugin
    /plugin install ive@ive

Codex:

    codex plugin marketplace add reveriext/ive-plugin

ChatGPT: add `reveriext/ive-plugin` as a marketplace in the plugins directory.

Any other assistant: add https://hyive.app/mcp as a remote MCP server, and the skill in
`skills/ive` where it keeps skills.

## Commands (Claude Code)

- `/ive:open`: Open Ive's editor of the person kit on the kit pulled into this folder.
- `/ive:pull`: Take the organisation's person kit, its brand, tokens and fonts, and your own details from Ive into this folder.
- `/ive:save`: Save a changed part of the person kit back to Ive, with the revision it was read at.

## Access

You sign in to Ive the first time the assistant uses it. It can then do only what your role in
your organisation allows, within the guardrails your organisation sets. The plugin holds no keys
and nothing of any organisation.

## Contact

hello@reveriext.com
