<!--
Sources, in the Ive repository:
- packages/tenant/src/mcp.ts (search, search_files, get_knowledge_index, list_records, get_record, get_kinds, check_record, save_record, get_usually_kept, set_not_for_us, save_company_words, order_pages, withdraw_change)
- packages/core/src/kinds.ts (what every organisation is asked, isContentPage, PAGE_DEPTH, KEPT_INSIDE)
- packages/core/src/usual.ts (what most organisations keep about themselves)
- packages/core/src/okf.ts (how a page is published)
- packages/tenant/src/index.ts (what an editor writes waits for an admin)
- packages/tenant/src/knowheld.ts (an editor's order of the pages, company's words and not for us wait for an admin)
-->

# The knowledge

## State only what the knowledge says

- **`search`** first. A search that finds nothing is recorded as a gap the organisation should
  fill; say that you did not find it, and do not fill the gap from memory.
- **`search_files`** finds the documents kept as sources, and the rest of the files, by their
  name and by what they say; a document found by its words comes with a line of it.
- A page read with **`get_record`** carries its `status` in the knowledge format's own words:
  `stable` is approved and in use, `draft` is waiting for a person, `deprecated` has been put
  away.
- Every page says **where it comes from** and **how sure** the organisation is. A page marked
  `stated_claim` or `needs_check` is not a fact to repeat as settled; `internal_only` is not
  for anything that goes outside.
- A page names its **sources** (a link, a website, a document kept in Ive). Cite the source
  the page gives, not one you found elsewhere.

## The company, in its own words

- The company's page says **how it is named**: its short name, how the name is written in a
  sentence, and the ways it is never written. Write the name as it is written there, and never
  in one of the ways it is not.
- It says **how it is described** at three lengths: one line (20 words or fewer), a short
  description (about 50) and a long one (about 100). Use the length that fits, word for word;
  do not write a fourth.
- The **legal name**, the **short description** and the **website** are kept once, in the
  organisation's settings (the letterhead and the press kit read them there), and the company's
  page shows them. They are kept with **`save_company_words`**, by an admin's own connection
  or an editor's (an editor's waits for an admin); never put them in the page's fields.
- Its **official profiles** are where it is, officially. Link to those, and to no other page
  that claims to be the company's.

## Questions

- A **question** page is something people ask, with **the short answer first**
  (`data.fields["short-answer"]`, two sentences that stand on their own) and the full answer
  as the page's words. Give the short answer first, and the full one only when it is wanted.
- `also-asked` holds the other ways the same question is put. Look there before saying a
  question has no answer.
- A search that finds nothing waits for an admin as something to answer. Do not answer it
  yourself from memory.

## Competitors

- A **competitor** page is **kept inside**: read it to prepare, and never quote it, name it as
  a source or put what it says in anything that goes outside (a proposal, a post, an email to a
  customer). It is left out of every export, and starts as `internal_only`.
- "Where they win" and "Where we win" are for the team's own thinking. How to answer when the
  competitor comes up is a question page it links to (`answer`): that answer is the one to
  give.

## What is missing

- **`get_usually_kept`** with place `company` says what most organisations keep about
  themselves and how this one stands: kept, missing, or not for it. Ask the person for what is
  missing, one thing at a time, and write it only from what they or the organisation's own
  sources say.
- Something the person says is not for them is set aside with **`set_not_for_us`** (an
  admin's own connection, or an editor's, whose waits for an admin), and is not asked for
  again.

## The shape of it

Knowledge is **pages**. Two sorts:

- A **content page** is a document somebody wrote. Pages sit under pages, five levels deep at
  most.
- A **data page** has a set shape: a person, an offering, a partner, a credential. Each asks
  for particular values. Read **`get_kinds`** before writing one, so it fits the first time.

## Writing

- The knowledge is written by an editor or an admin, and read by everybody else. You may write
  it only where the person is one of them and let you write; otherwise a save of a page is
  refused. Say so, and that an admin marks who is an editor.
- Use **`check_record`** before **`save_record`**; it says what is wrong without saving.
- Write a page's words as Markdown. Tables, task lists and code blocks are all read.
- Put the values a data page asks for in `data.fields`, not in the prose.
- Name the page it sits under with `data.parent`, and the sources it draws on with
  `data.sources` (the slugs of pages of the kind `source`).
- To cite a source where the words say it, link to it in the body:
  `[its name](/knowledge/base/<slug>)`. A source linked that way is added to `data.sources`
  for you. Another page is linked the same way.
- What an editor writes is **not in use until an admin approves it**, however it was saved.
  Say so; do not tell the person it is published. The same holds for the order of the pages
  (**`order_pages`**), the company's words and what is not for us.
- Only one change to a page, or to each of those, waits at a time. Where somebody else's
  waits, a save is refused, an admin's own included: say whose it is, and that an admin
  approves it, sends it back or closes it first. The person's own change that waits, or
  that an admin sent back, is theirs to change and save again, or to take back with
  **`withdraw_change`**, only when they ask.
