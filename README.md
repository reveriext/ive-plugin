# Ive

The Ive plugin, 0.22.0: Ive's skill, the connector to Ive (https://hyive.app/mcp) and the
commands and editor for the person kit. It is the same for every organisation and holds nothing
of any of them: you sign in to Ive the first time the assistant uses it, and you are given what
your role in your organisation allows. Nothing here is a key.

This repository is written by Ive's release, from Ive's own sources. Do not change it here.

## Claude Code

    /plugin marketplace add reveriext/ive-plugin
    /plugin install ive@ive

## Codex and ChatGPT

    codex plugin marketplace add reveriext/ive-plugin
    /plugins

In the ChatGPT desktop app or the Codex app, add this repository as a marketplace in the plugins
directory, then install Ive from it.

## Any other assistant

Add https://hyive.app/mcp as a remote MCP server (streamable HTTP, OAuth sign-in), and put
`plugins/ive/skills/ive` where the assistant keeps its skills (https://agentskills.io).
