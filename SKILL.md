---
name: journal-reports
description: "Reports: what the user gets back when they asked to have something checked, researched or reviewed — reports add with the text on stdin, --about to tie it to the to-do or question that prompted it, what belongs in one (what was asked, what was found, what was found to be fine, where it stands), and why a report is not a doc and not a list of to-dos. Use it whenever the user asks you to look into, check, investigate, compare or review something, whenever you dispatch a subagent to do research (rule 9: the dispatcher writes the report), and when a report should be archived or turned into a doc. Not for subagents."
---

# Journal reports

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Is it a report?

    something the user asked you to CHECK, and the answer                  a report
    something that stays true, that a later session needs                  a doc
    something to DO next                                                   a to-do
    what you are doing right now                                           work

A report is **the situation as you found it, written for the user**. It is read once, by a
person, and it ages out; that is why it is neither a doc (which a session is handed, and
which must still be true next month) nor a to-do (which is an instruction to yourself).

## Writing one

    journal reports add "<what was asked>" --brief          the report on stdin
    journal reports add "<title>" --about="todo 22"         tie it to what prompted it
    journal reports                                         what has been written here
    journal reports show <n>                                one in full
    journal reports archive <n> "<why>"                     take it off the list
    journal reports doc <n>                                 it turned out to be a doc after all

**The title says what was ASKED, not what you concluded.** "Four agents reviewed the Vue
and Python: what they found" is a title; "the code is fine" is a conclusion, and a title
that is already the answer makes the report look optional.

**`--about` is how it stops being loose.** A report written for a to-do, a question or a
plan says so, and the row it names links back to it.

## What belongs in one

Four things, in this order, and the third is the one that gets dropped:

1. **What was asked** — in the user's terms, including what you took it to mean.
2. **What you found**, worst or most surprising first, each with where it is: a file and a
   line, a command's output, a measurement. A finding nobody can check is an opinion.
3. **What you found to be FINE** — the things you checked that were not wrong. Without it
   the user cannot tell the difference between "clean" and "not looked at", and that is
   most of what they are buying.
4. **Where it stands** — what has been fixed already, what is on the list and as which
   to-do, what is still undecided.

**Say what you did not do.** A check you skipped, a case you could not reproduce, a file
you did not read: one line each. A report that only contains successes is read as complete
when it is not.

## Research dispatched to a subagent ends in one

Rule 9, and it is the whole reason this skill exists: when you send subagents to find
something out, **you** write the report from what they send back, because a subagent has no
ledger and its transcript is not something the user can read. Filing the findings as to-dos
is not a substitute — a to-do says what to do next, never what was checked. Write the
report first, then file the rows, then say in the report which rows they became.

## What happens to it

A report **ages out** — `journal reports keep <days>` per environment — because a stale
report of a situation that has moved on is worse than none. Archiving is the same act done
by hand, with a reason (`reports archive <n> "<why>"`).

**If it turns out to be a doc, say so with `reports doc <n>`** rather than writing the
same thing twice: what stays true belongs where sessions are handed it.

**The user reads it in the viewer**, where a new report waits under "Waiting on you" until
they open it, and where they can comment on it. A comment on a report reaches you at your
next stop, so a report is a conversation, not a one-way delivery.
