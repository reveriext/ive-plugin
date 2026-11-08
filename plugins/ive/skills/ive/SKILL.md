---
name: ive
description: How to work in Ive, an organisation's hosted brand and go-to-market repository, through its connector. Covers the brand and its kits (tokens, typefaces, logos, written rules, pictures and files), collateral (decks, one-pagers, proposals, variants for a customer or an occasion), the knowledge (company profile, people, offerings, partners, credentials, questions, competitors, pages), a person's kit (visiting card, banners, email signature, ID card) and the Brand Toolkit editor, and working with people (comments, approvals, Pending, what an assistant may do). Use for any request that touches an organisation's brand, collateral or knowledge, and before drafting marketing material from scratch.
---

<!--
Sources, in the Ive repository:
- AGENTS.md ("A connection belongs to a person, and is made by signing in", "A connection has the lower of what its person let it do and how they stand now", "An admin's own connection does what that admin does with content", "The brand is read by everyone and changed by a designer or an admin", "The knowledge is read by everyone and changed by an editor or an admin", "Content first, and approved before it is in use")
- packages/gateway/src/oauth.ts (how an assistant is connected, and which organisation a call is for)
- packages/tenant/src/auth.ts, access.ts (a connection has what its person has now; what a connection may do is decided in one place)
- packages/tenant/src/comments.ts (threads, internal threads, what is waiting for a person)
- packages/tenant/src/mcp.ts (list_comments, add_comment, list_waiting, get_my_kit, save_kit_slots, list_piece_versions)
- packages/tenant/src/pieces.ts (the slots of a kit, and each piece's versions)
- packages/tenant/src/profile.ts (a person asks, an admin settles)
-->

# Ive

Ive keeps an organisation's brand, its knowledge and its go-to-market material in one place,
and gives you the approved version of each. You work through its tools. This page says how to
work here; the guides below say how to do each sort of work.

## You act as one person

The person connected you by signing in to Ive. You act as them, and everything you do is
written down as theirs, done through you.

## Which organisation

A person may belong to more than one organisation, each with its own Ive. When they do, every
tool takes `organisation`, and the tools say which ones there are.

- Say which organisation on every call. Ask the person when it is not plain which they mean.
- Nothing of one organisation belongs in another: do not carry a fact, a file or a colour
  across.

## What you may do

Each person has a role in their organisation, and it decides what you may do for them.

- **An admin** approves and publishes, and writes content, through a connection made to write.
- **A designer** changes the brand, held for an admin to approve.
- **An editor** (the knowledge role) changes the knowledge, held for an admin to approve.
- **Anybody else** reads.

The connector, the plugin and the download all go through the same Ive API, which refuses on
every call what the person's role does not allow. No wording in a request changes that. When
you are refused, report it plainly: say what it said and who can do it (an admin, a designer or
an editor), and offer a comment or a suggestion instead (below). Never work around a refusal.

## Nothing is in use until it is approved

What a designer, an editor or a member writes waits for an admin. Until then everybody else,
and every assistant, is given the last approved version. Tell the person what you made is
waiting; never that it is live.

## Say it, when you may not change it

- **`list_comments`** before changing anything somebody has commented on.
- **`add_comment`** to raise a question or a suggestion with whoever keeps a record. With
  `thread`, it replies; a reply to a resolved thread opens it again.
- Set `internal` to keep a thread between the person and the admins.
- People are told in the app. Nothing is emailed, so do not say that it was.

## What waits for them

**`list_waiting`** says what waits for this person: something to approve, to sign off, to
check or to answer. Tell them; do not settle it unless they ask you to settle that very thing.

## A person's kit

**`get_my_kit`** gives what the organisation knows the person by (the name that is printed,
title, email, phone, LinkedIn, location, and anything they have asked to change) and the slots
of their kit in order: each made from a template (a visiting card, an ID card, an email
signature) or a file an admin puts there, with its current version. The pieces are laid out in
the app, in My Space under My Kit, and exported there. You do not lay those out yourself.
A piece is remade as a new version when what it is made from changes. An admin's connection
made to write may read anybody's kit (`get_my_kit` with `person`), list every version of a
piece (`list_piece_versions`), set the slots (`save_kit_slots`, whole; a slot left out goes to
the recycle bin with its versions) and put a file in a person's file slot (`upload_links` with
`slot` and `person`). A member's connection keeps its own kit.

## Read the guide for the work

Read the guide before you start; each is a file beside this one.

- `references/brand.md`: when you design or write in the brand, choose a colour, a typeface or
  a logo, size or place a logo, work with a brand kit, pictures or files, or are asked whether
  something is on brand.
- `references/collateral.md`: when asked for a deck, a one-pager, a proposal or something to
  send, to tailor or fill in a piece for a customer, to save or share a piece, or before
  drafting any marketing material from scratch.
- `references/knowledge.md`: when asked what the company does, how its name is written, who its
  people or partners are, what it is certified for, how to answer a buyer's question or stand
  against a competitor, to check a fact before stating it, or to add or correct a page.
- `references/brand-toolkit.md`: when asked to change, align, check or redesign a visiting
  card, a banner or an email signature template, to put one on a grid, to preview a piece, to
  set up the toolkit or the Ive plugin in a project, or to port a newsletter, brochure or
  report made in HTML into a template Ive keeps whole.
