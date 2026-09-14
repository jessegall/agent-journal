---
name: journal-questions
description: "Asking the user through the journal and proposing changes: questions add with a one-line question, --description, each choice as its own --option and a --pick, never the choices written into the question's text; acting on answers; and filing a suggestion instead of saying it. Use it before you ask the user anything, including 'which do you prefer' or 'should I', whenever the question tool is refused, when a hold says a question was answered or a suggestion decided, and whenever you think something should be done differently than asked. Not for subagents."
---

# Journal questions and suggestions

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Questions: ask the user through the journal

    journal questions add "<question>" [--about=<ref>]... [--description="<context>"] [--option="<a choice>"]... [--pick=<n>]   ask; the session keeps going
    journal questions                                     open ones first, then answered
    journal questions show <n>                            the question, what it is about, the answer
    journal questions link <n> <ref>                      about one more thing; `unlink` takes one off
    journal questions edit <n> "<question>"               reword it; if it was answered, the user is asked again

**You may always ask the user.** When something only they can answer comes up, ask — through
the journal. `questions add` never halts the session: file it, say in your reply that you
asked, and carry on with whatever does not depend on the answer. The next stop tells you
when it is answered. The harness's question tool is the one that halts a session, and with
auto on it is refused; the journal's question is always available.

**A question is its own resource and can be about anything:** `--about="todo 22"`,
`"doc 4.1"`, `"pin 3"`, `"rule 2"`, `"inbox 5"` — as many as it concerns. Ask about a pin
you doubt or a doc part that seems wrong, not only about a to-do. A to-do with an open
question waits on the user, and `todos ask <n>` is the same as `questions add --about="todo
<n>"`.

**Write a question the user can answer at a glance.** The question itself is one short
line. What they need to decide well goes in `--description` — the situation, what each way
costs — and when the answer is one of a few choices, give each as an `--option`: in the viewer
the user clicks one, or writes their own. When you recommend one, say which with `--pick=<its
number>`: the viewer marks it as the agent's pick, so never write "(my pick)" into the option's
text. An option that needs explaining gets `--option-description="<why>"`, and one best shown in
code gets `--option-code="<example>"`, each right after its `--option`, so the label stays one
short line. Never list the choices in the question's own text ("A) … B) …", "1. … 2. …", bullet
lines): the user cannot click those, and `questions add` refuses it. A question that makes them read your transcript to
understand it is a question they will answer wrong.

**An answer can change.** The user answers from the viewer or the terminal, and may answer
again: the new answer replaces the old one, which is kept, and the next stop tells you again,
marked "(a new answer)". Act on the latest answer, not the one you remember.

## Coding style: a review becomes rules

    journal questions add "<which is right?>" --about="style" --option="<one way>" --option-code="<its example>" ...
    journal style add <subject> "<title>" --decision="<the rule, one line>" --when="<what code it covers>" --brief
    journal style                                   the rules there are

**When the user asks for a coding style review**, from the Coding style page or in words,
dispatch a background subagent to do the reading, and name its model (`sonnet`: careful
reading, nothing to invent). It reads where the user said to look, or the code it judges most
typical, and reports each place where the same thing is written two ways: naming, guard
clauses, error handling, how a class is laid out. It reports with a short real excerpt of each
way. It writes nothing.

**Settle the obvious ones yourself.** When one way clearly dominates, or a rule, pin or
earlier answer already decides it, write the rule with `journal style add` and name it in
your reply; do not ask. The user said so: most of these have obvious answers. Ask only where
the code is genuinely split, or where the choice is a real preference.

**Each remaining difference becomes one question.** Ask it `--about="style"`, or `--about="style
<subject>"` when a rule already exists and the difference is about it. Give each way as an
`--option` with an `--option-code` example long enough to judge, a few real lines rather than
one token. The Coding style page puts these at the top, with the code side by side.

**Each answer becomes a rule, one subject each.** `journal style add` with the chosen way as
the decision. The brief on stdin carries `## Why`, `## Examples` (the bad and the good, from
the question's code) and `## Triggers` (a phrase per line that should load it). A rule that
already covers the subject is changed with `journal style set`, never duplicated. Every change
writes the rule's `style-<subject>` skill for you.

## Suggestions: propose, and let the user decide

    journal suggest "<the change, in one line>" --brief [--about=<ref>]...   propose; the work goes on as asked
    journal suggestions                              the ones waiting on the user
    journal suggestions show <n>                     one in full, with the user's decision
    journal suggestions withdraw <n> "<why>"         it stopped being worth it

**When you think "we should do this differently", file it, do not say it.** A thought in a
reply scrolls away; a suggestion waits in the viewer until the user accepts, adjusts or
declines it. The title is the change. The brief says what you saw, what it costs now, and
what it would cost later.

**A suggestion never changes the work in hand.** Keep doing what was asked, the way it was
asked, until the user decides. If the asked way is wrong — it breaks something — that is
`[!blocked]` or a question, not a suggestion.

**Not a suggestion:** something the user asked for (a to-do), a choice you can make under
the rules that stand (make it), or a matter of taste.

**Accept, adjust and decline are the user's**, from the viewer or their own terminal, and
are refused when you run them. Accepting or adjusting files a to-do; with auto off, it waits
for the user's word like any other. **A decline is a ruling:** do not file it again in other
words. Only something that has changed reopens it, and `--despite=<n> --because="<what changed>"`
says what. At most five wait on the user per environment.

The next stop tells you what the user decided. Act on the latest decision.
