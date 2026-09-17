---
name: journal-messages
description: "Handling what the user sends through the journal: processing a message part by part (routing each part, answering a question part with messages reply --part and a clickable follow-up), acting on comments on to-dos, docs, messages or work, notifying the user sparingly, and what the web viewer and its channel do. Use it whenever a stop, a hint or a channel notice says the user left a message or a comment, before you send a notification or the user asks to be told when something is done, and whenever the user talks about the viewer, its pages or the channel. Not for subagents."
---

# Journal messages, comments, notifications and the viewer

**Not for subagents.** A subagent reports what it found; the main conversation files it.
It is one of the journal's skills; the core `journal` skill says when each applies.
Every command runs through `.journal/journal.py`; `journal` is an alias for it.

## Messages: what the user left for you

    journal messages                                              waiting messages first, then processed ones
    journal messages show <n>                                     the message, its parts, and the questions about it
    journal messages process <n> --part="<words>" --became=<ref>  one part, and what it became
    journal messages reply <n> "<answer>" --part="<words>"        a part that asks something: answered, and the user notified
    journal messages file <n> <name> "doc <doc>"|keep             an attached file: into the doc it belongs to, or kept
    journal messages done <n>                                     processed, once its parts say what they became and its files are filed
    journal messages move <n> "<environment>"                     left on the wrong environment: carry it there
    journal messages edit <n> "<text>"                            reword one that still waits

The user leaves messages instead of interrupting you — mostly from the journal's web viewer,
while you work: instructions, follow-ups, corrections, things to remember, new work. It belongs to an environment, like a pin. When a
stop says the user left messages, process them before anything else — one at a time:

1. **Split it into parts.** A part is the stretch of the message that asks for one thing;
   `--part` quotes its words, and a part that is not in the message is refused.
2. **Route each part to what it is**, by the same rules as a chat message:
   - new work is a to-do — `todos add` — unless the message says to do it now;
   - a correction to the open work is `work update`, recorded as `--became=work`;
   - a fact that must survive is a pin, one that binds every environment is a rule, and
     something you keep having to be told is a reminder;
   - an acknowledgement, or something already done, is `--became=noted`;
   - a question the user asks you ("are we doing this already?") is answered, not parked:
     `messages reply <n> "<the answer>" --part="<the question's words>"` records that part as
     answered, puts the answer under it in the viewer and notifies the user. Only the question
     parts: the rest of the message is routed as usual. **An answer that leaves a decision
     open ends with a follow-up the user can click:** add `--follow-up="<the question>"
     --option="<a choice>" [--option-description="<why>"] --option="<another>" [--pick=<n>]`
     to the same reply — make it a to-do, change it now, leave it as it is.
3. **A part you do not understand becomes a question, never a guess:** `journal questions
   add "<question>" --about="inbox <n>"`, recorded as `--became="question <q>"`.
4. **Record each part, then close the message:** one `messages process` per part, several
   `--became` if a part became several things, then `messages done <n>`.

### A transcript

A transcript is not a long message: it is sent as its own kind and worked its own way.
The `journal-transcripts` skill says how — read it before filing anything out of one.

**You may reply to a message**, and it is never required: `journal messages reply <n> "<text>"`
puts a short note under it in the viewer. Use it when the user would want to know how their
words landed beyond what the parts record: you did it differently than they wrote, you had to
make a call on something they left open, or a part needs a word of explanation. Not for
"done" — the parts already say that.

A message is never deleted. Its record — each part beside what it became — is how the user
sees their words landed where they meant. Between stops, the first tool call after a new
message mentions it once; that never blocks, so finish the step you are on first.

## Comments: what the user said about something

    journal comments                            what the user said, not handled yet
    journal comments show <n>                   one in full
    journal comments done <n> "<what was done>" it is handled

The user comments from the viewer on a to-do, doc, pin, rule, reminder, suggestion, message
or piece of work. Every comment is a nudge: the next stop names it. Act on what it asks —
amend the to-do, strike the pin, add a part to the doc, answer it in your reply — then
`comments done` it, saying what was done. A comment on a piece of work (`work 7`) is about
that work while it runs: a question to answer or a steer to follow before you end it. A
comment that asks for new work is a to-do like any other request.

## Notifications: tell the user, sparingly

    journal notify "<what finished>" [--about="todo 22"|"message 5"]   it lands at the top of the user's Home

**Notify when the user asked to be told**, or when a long piece of work has landed that they
are waiting on: a migration through, a research report ready, a to-do they cared about done.
**Not for progress.** Each step, each commit, each to-do closed in auto mode is a `work
update` or nothing; a Home full of notifications is one the user stops reading. One line,
saying what is now true, pointing at the to-do, report, doc or message it is about.

## The viewer: what the user does in the browser

    journal serve [--port=<n>]      the web viewer, on this machine only: 8420, or the next free port
    journal claude [flags] ["<prompt>"]   start Claude with the journal's channel, and the web
                                          viewer if none is running here; other flags pass through to claude
    journal statusline --install    show environment, open work and viewer in the status bar — only if the user wants it

The user reads and changes the journal in a browser while you work: they leave messages,
answer questions, add and edit to-dos, pins, rules, reminders and docs, change a to-do's
priority or what it waits on, retire what is stale, switch auto mode on an environment's
Settings page, and remove old environments. Every one of those goes through the same
controllers the terminal commands use, so it lands in the same record and obeys the same
refusals (a closed to-do cannot be edited, a struck pin cannot change).

**A session started with `journal claude` hears the viewer while idle.** A message the user
leaves wakes it; with auto mode on, an answered question, a comment and a decided suggestion do too,
and only while it is idle. With auto mode
off, nothing but a message wakes it, and a wake-up is never a reason to start on the to-do list.

**So the record can change under you.** A to-do you are working may have been re-prioritised
or rewritten, and a pin you rely on may have been struck. Before acting on something you read
a while ago, read it again. What the user did in the browser reaches you as a message, an
answer, or a changed record, never as chat.
