---
name: journal-docs
description: "Where findings go: a report for what was checked, measured or researched (temporary), a doc for lasting documentation of the codebase or environment (catalogued, cited, with attachments), a plan for what will be done and in what order (phases of to-dos), and a tool for a script worth keeping. Use it whenever the user asks you to check, measure, investigate or research something, asks for a report, or asks to document or write something down; when you are about to write a plan or break work into phases; when something is ruled and should be recorded; before re-investigating what a doc may already settle; and before writing a script the next session could reuse. Not for subagents."
---

# Journal reports, docs, plans and tools

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Reports: what the user asked to have checked

    journal reports add "<title>" [--about="todo 22"] --brief   the report, its text on stdin
    journal reports                                            what has been reported here
    journal reports archive <n> "<why>"                        off the list

**A report is temporary; a doc is lasting.** They are easy to mix up, and the user reads them in
different places, so decide before you write:

    a REPORT   the situation as it was when you looked: what you checked, measured or researched,
               what a subagent found, where something stands. True today, stale next week.
    a DOC      documentation of the codebase or the environment: a design once it is ruled, how
               a part works, the numbers behind a decision. Stays true until it is changed.
    a PLAN     what will be done on this environment and in what order: phases, each made of to-dos.
               It ends when the work ends. Not a doc, and not a doc part titled "Plan".
    neither    a one-line answer goes in your reply; a fact that must survive goes in a pin.

When the user asks for something to be checked, measured or researched, or asks for a report, or
you send subagents to find out, the answer is a report, not a doc, even when it is long. Title
it by what was asked, start with the answer, then the evidence. No session is handed a report,
so if it settles something that stays true, pin that too or write it into a doc.

## Plans: what will be done, in what order

    journal plans add "<title>" --goal="<what is true when it is done>" --brief   a draft, its approach on stdin
    journal plans phase <plan> "<title>" --when="<complete when>" [--checkpoint]  a phase, added in order
    journal plans todos <plan> <phase> <to-do numbers> [--off]   put to-dos in a phase, or take them out
    journal plans show <plan>                                   its phases, their to-dos, where it stands
    journal plans link <plan> "doc 4.2"                         a doc or a report it rests on
    journal plans from-doc <doc>                                a draft plan from a doc's "Phase …" parts
    journal plans abandon <plan> "<why>"                        stop one, with the reason

**Ask what you are about to write.** Does it say what to do next? It is a plan. Would it still be
worth reading once the work ships? It is a doc. A plan already written into a doc is
turned into one with `journal plans from-doc <doc>`, and `journal cleanup` lists the docs that read like one. Is it what you found? It is a report. Work of one
or two to-dos needs no plan: file the to-dos.

**The user approves a plan; you cannot.** A draft changes nothing until the user approves it in the
viewer. Then auto mode picks to-dos from the current phase only, the first phase not complete, and
to-dos outside the plan only when their priority is above the default. A phase is complete when all
its to-dos are done; nobody ticks it. A phase marked `--checkpoint` stops the work once it is
complete, until the user continues it. When the plan is done, write what in it stays true into a doc.

**"Plan with me" is a message from the viewer's New plan.** The user knows roughly what they want and
not yet the goal. Shape it with them before you draft anything: one question at a time, each with two to
four answers to pick, `journal questions add "<question>" --option="<answer>" --option="<answer>"`, and
read each answer before the next question. When the goal is one clear line, draft the plan with
`journal plans add`, its phases and their to-dos, and tell the user it is ready to approve.

## Docs: what was settled, catalogued

    journal docs                                the catalogue: number, title, status, parts, files, abstract
    journal docs show <doc>  |  journal docs show <doc>.<p>   read a doc, or one part; <doc> is its number or its name
    journal docs files <doc>                    its attachments, as a tree (also: `docs <doc> files`)
    journal docs paths <doc>                    one absolute path per attached file — put these in a subagent's prompt
    journal docs add "<title>" --abstract="<one line>" --brief    a new doc, its intro on stdin
    journal docs part <doc> "<title>" --brief   a section or a lasting finding, as one part
    journal docs attach <doc> <path> "<what it is>"   a file or a folder, copied in beside the parts
    journal docs strike <doc>.<p> "<why>"       drop a part, on the record
    journal docs final <doc>                    when it is settled
    journal docs search <term>                  every line of every doc mentioning it

A pin is a claim, a rule binds, a to-do is work. A **doc** is lasting documentation: a design
once it is ruled, how a part of the codebase or the environment works, an investigation's
numbers that a decision rests on. What things look like right now is a report, not a doc. It lives in the
project's `docs/` folder as ordinary markdown the user reads and edits, and the journal
catalogues it: every session is handed the catalogue, one line per doc, so nobody
re-investigates what a doc settles.

**Write a doc at the moment something is ruled**, with the ruling as its first line, and
give it a TITLE that says what it settles, because the title is all a later session sees
until it opens the doc — the injected block carries titles only, and the abstract waits in
`journal carry` and `journal docs`. A title that needs its abstract to make sense is a
title nobody will follow. A subagent's findings are a report
(`journal reports add`); only what in them stays true goes into a doc, as a part, filed by you.
Everything else that is long — a survey, the numbers behind a decision — is a part too.
One doc, many parts; a part is what you replace or strike when it stops being true.

**Attach what is not prose.** A design's HTML, a screenshot, a PDF the user was sent,
the CSV behind a finding: `journal docs attach <doc> <path> "<what it is>"` copies the
file — or a whole folder — into the doc, beside the parts that explain it; the original
stays where it is. `journal docs <doc> files` shows them as a tree, `docs search` finds
them by name. Attach rather than `cp` into docs/: the copy is listed, said what it is,
and handed to the next session; a bare file is not. The hook says so when you keep
re-reading a file that is not source — attach it, or ignore the hint if it is scratch.

**By name or number.** A doc is referenced either way, everywhere: `journal docs
reactivity`, `docs attach reactivity …`, `--doc=reactivity`. The title, or a unique
part of it.

**Cite it.** `--doc=<doc>` or `--doc=<doc>.<p>` on `pin`, `rule` and `todo` ties the entry
to the doc; the entry shows "→ doc 4.2: <doc> · <part>" beside it, and the doc shows what
cites it. Cite whenever the claim came out of a doc or a doc explains it: the pin is the
one line, the doc is the reasoning a later reader will want. A
pin that only says "read docs/x.md before touching Y" is an abstract wearing a pin; give
the doc that abstract and cite it instead.

**Before re-investigating, read the catalogue.** If a doc covers it, read the doc. If a
doc is wrong, do not write beside it: strike the part, or write the new doc and
`supersede` the old one so every later reader is pointed at the current one.

A markdown file written by hand outside the catalogue earns a hint, once: not a problem,
but if it is a design or a report, file it as a doc so it is handed on and found.

## Tools: scripts kept for repeated work

    journal tools                       every tool: what it does, how to call it
    journal tools show <name>           read one (`show` reaches a tool named after a verb)
    journal tools run <name> …          run it from the project root
    journal tools add <name> "<title>" --summary="…" --usage="…" --entry=<file> [--brief]

A script you wrote for a job that will come again — move a class with every reference,
list uncovered methods, run a fixer on one directory — is a tool. Put it under
`.journal/tools/<name>/`, or leave it where it is and point `--entry` at it, and
catalogue it with its title, summary and usage — a tool without a title or a summary is
refused, and neither can be blanked later, because they are what the catalogue hands on. Every session is handed the COUNT of them beside
`journal tools`, which is the catalogue, so the next agent runs yours instead of writing it
again. Before writing a script, read the catalogue. Running a tool is a write: declare the work first.
