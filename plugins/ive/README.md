# Ive 0.22.3

Ive, your organisation’s brand, knowledge and collateral, in your AI assistant: the connection, and how to work in it.

## Install

The full steps for each assistant are on your Connections page in Ive.

### Claude Code

    /plugin marketplace add reveriext/ive-plugin
    /plugin install ive@ive

In Claude Code the plugin also adds commands and an editor for the person kit:

- `/ive:open`: Open Ive's editor of the person kit on the kit pulled into this folder.
- `/ive:pull`: Take the organisation's person kit, its brand, tokens and fonts, and your own details from Ive into this folder.
- `/ive:save`: Save a changed part of the person kit back to Ive, with the revision it was read at.

### Claude, on the web and the desktop

Customize › Plugins › Add › Add marketplace: `reveriext/ive-plugin`.

### Codex

    codex plugin marketplace add reveriext/ive-plugin

### ChatGPT

Plugins › + › Add custom MCP server: https://hyive.app/mcp, with OAuth.

### Any other assistant

Add https://hyive.app/mcp as a remote MCP server, and the skill in `skills/ive` where it
keeps skills.

## Access

You sign in to Ive the first time the assistant uses it. It can then do only what your role in
your organisation allows, within the guardrails your organisation sets. The plugin holds no keys
and nothing of any organisation.

## Contact

hello@reveriext.com
