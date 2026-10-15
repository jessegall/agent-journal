# Messaging and chat marks: requirements

How the chat between you and the agent behaves, read from version 3's features (`v3.bak/src/features/messages`,
`command_tags`, `chat_etiquette`, `acknowledgements`, `thinking`, `close_from_commits`, `message_buttons`,
`message_todos`, and the viewer's `domain/thread.js` and `domain/chatVisibility.js`), with the rulings made on
2026-10-15. Each numbered line is a requirement for version 4. "V4 today" at the end says what stands and what
does not.

## 1. The chat

1. One thread per environment, newest at the bottom, built from: your messages, the agent's messages, replies
   (a comment on a message, the message quoted above it), receipts ("Filed to-do 7 from your message"), questions,
   suggestions, pending messages still on their way, and marks: skills loaded, compactions, subagents, whispers,
   thoughts, cards and documents the agent made.
2. Four or more marks of one kind in a row fold into one group ("3 skills loaded", "4 rules and facts recalled").
3. The Shown menu hides kinds. Agent: thoughts, skills, subagents, helpers, compactions, documents made,
   acknowledged reminders. Reminders: rules, facts, reminders. Other: long commands, commits, sequences, every
   sequence step, triggers, plugin notes, visitor comments, filed from your messages, notices. Hidden by default:
   acknowledged reminders and sequence steps.
4. Two replies with the same answer within two minutes merge into one bubble quoting both messages.

## 2. Your message to the agent

5. The moment a message arrives and an agent is live, the journal types one short line into its terminal and
   presses Enter: `[journal] new message 4`. Several at once: `[journal] new messages 4, 5, 6`. More than three
   waiting: `[journal] 7 messages unread: journal message unread`. The same three forms at session start, at a
   prompt and at a stop. Never the words.
6. The words reach the agent once, when it opens the message: `journal message read 4` prints it with
   `reply with [!reply:4] in your turn` under it and marks it read; `journal message unread` does the same for
   every unread one.
7. Version 3's pacing, to keep as settings: while more than five wait unread, or once the agent is idle, the
   inbox is named again at the next tool use and every third after; after five reminders its writes are held.
   A message read and left unanswered is named again after ten tool uses, three times at most, and then every
   tool call is held until it is answered; only a journal command that answers it goes through.
8. A message is answered by a reply, by a reaction, or by being processed into rows (a to-do, a fact, a plan)
   that the reply names or `journal message process` links. A message that asks something is answered only by
   written words. A message that only acknowledges ("ok", "thanks", "carry on") gets a reaction, not words.
9. An answered message closes. A message the agent wrote closes as soon as you have seen it.
10. Filing a to-do from your message does not answer it: when the message asks or proposes, the agent also says
    whether it agrees and what happens when. A to-do filed within five minutes that the reply names is linked to
    the message and shown above it; one left unlinked is pointed out once.
11. A message can carry pictures; the agent must open a picture and say what it shows (`journal message tag`)
    before it may answer.

## 3. The agent's words to you

12. What the agent writes for you comes from the display hook, streamed in parts; the whole turn is posted once
    its last part is in. The same words are never posted twice: a turn is keyed by its id, and the very words
    said within a minute are not posted again. When the display hook does not deliver, the transcript fills the
    chat for that turn and a fault is raised, so a hook that stopped arriving is never hidden.
13. A turn with no tag is a message from the agent; its first line is the title.
14. A turn that is only an emoji is not posted; the agent is told to react instead.
15. A turn that only answers a journal line and changes nothing ("Noted") is kept as a message marked
    acknowledgement and left out of the chat; an answer to you, a question, a failure, a turn that changed files
    or a reply that asks you something always reaches the chat.
16. Under a sequence step that talks in the sequence, the turn goes to the sequence, not the chat.
17. The agent's live thinking stands in the working bubble while it works, each thought replacing the last; a
    visible message or the next turn clears it. Thinking never becomes a message, with one exception ruled on
    2026-10-15: a thought that opens with a reply tag for a message still unanswered is the reply the agent meant
    to say and is posted as such, since the user never sees thinking.

## 4. Tags

18. A tag opens a line: `[!name]`, `[!name:N]`, `[!name:N,M]` or `[!name="text"]`, with named arguments after it
    such as `about=("doc:80")` or `todos=(7, 8)`. Optional `> ` or `**` may precede it. A tag anywhere else in a
    line is text, not a tag. Each tag runs once per turn, keyed to the turn; several run in the order written;
    a refusal comes back as a nudge on the next turn.
19. Tags and what they run: `reply` runs `journal message reply N` with the turn as the reply (`N,M` answers both
    with one reply); `log` runs `work log`; `end` runs `work end N --how`; `todo`, `fact` and `rule` create that
    row with the turn as its brief; `await` runs `work await` with the rest of the turn.
20. The tag is stripped from what the chat shows. A `reply`, `log` or `await` turn is not also posted as a
    message, since the reply is the chat and the others are shown where they belong; a `todo`, `fact`, `rule` or
    `end` turn is posted as well, without its tag.
21. `reply` refuses: a message the agent has not read; a reply that is only an emoji (react instead); a picture
    not yet opened; a second reply to a message it already answered (add to that comment instead); a message
    written in a window (answer it there).
22. When the agent runs the command a tag stands for, the journal shows it the tag once in a while.

## 5. Replies, reactions, buttons

23. A reply is a comment linked to the message, shown under it with the message's lines quoted above (`> `),
    and marks the message answered.
24. A reaction is one face by one actor on one message; the same face again takes it off. Your reaction is acted
    on when it asks for something (a go-ahead) and never mentioned or answered.
25. A message the agent writes can carry buttons: each runs one journal command or sends a text as your message;
    a pressed button goes unless marked `again`; buttons of one `choice` go together; the agent can mark its
    `pick`.

## 6. Chat marks

26. Commit: every commit shows as a card "Agent committed <sha8> on `branch`" with its subject; a line
    `Journal: todos done N` on its own line in the message closes to-do N and the chat says so.
27. Cards from features, each with icon, tone or colour, label, detail and sometimes a row to open: a long
    command moved to the background (its command, state, when it ended); checks run; triggers fired; a question
    you answered; sequences started and finished and each step; memory checkpoints; a refusal to read a long file
    whole; suggestions; history searches with what they found; plugin notes; the agent lost in a restart.
28. Marks on the agent row: skills loaded; conversation compacted; subagents started, finished, stopped or
    refused, with their model and report; whispers, a rule, fact or reminder recalled because one of its words
    appeared, typed to the agent with its next line and shown in the chat; thoughts; documents the agent made.
29. Receipts: when your message was processed into rows and nothing else answered it, the chat shows "Filed
    to-do 7 from your message".
30. Read ticks on your messages: sent, then delivered when the agent has read it.
31. The status bar under the top bar plays a queue of status messages made from the commands the agent runs:
    the verb, the rolling parts, the counts and how long each stays; and the plan's progress.

## 7. What the agent writes

32. No journal talk in the chat: never "I replied", "marked it read", "a new message came in", nor the journal's
    nudges, holds or skill loads. Say what the work is and what it came to.
33. Speak to you, never about you: "you asked", not "the user wants". Name every row with its type: "to-do 12",
    "message 1712". A bare number that could name a row is pointed out.
34. Paragraphs apart: a turn of 400 characters and three sentences with no blank line is pointed out once.
    Em dashes are the mark of agent prose and are pointed out. Shop talk is quoted back once.
35. A voice changes the tone and how you are addressed, never the journal's words; code, commits, docs and briefs
    are plain.

## 8. The journal's lines to the agent

36. Every line the journal types begins with `[journal] `, is short, names numbers not words, and is an
    instruction, never a message (law L6): the agent acts on it and writes nothing about it in the chat.

## 9. Version 4 today

Stands: 5, 6, 13, 36, the commit card of 26, a status bar from tool entries, replies shown under the message.

Missing or wrong:

- The reply tag is read anywhere in the text and makes a message with `reply_to`; by 18 and 20 it must open a
  line and the turn must become a comment on the message, not a message. Claude put the tag at the end of its
  turn in the dogfood run and the journal accepted it.
- 7, 8 (reactions, processing), 9, 10, 11, 12 (transcript fallback and the fault), 14, 15, 16, 19 beyond
  `reply`, 21, 22, 24, 25, 27 beyond commits, 28, 29, 30, 33, 34: not built.
- Found behind the dogfood run of 2026-10-15 12:24: one failing piece of deferred work killed the server's
  deferred worker, and every later deferred listener, the turn recorder among them, waited in its queue for good
  with nothing logged. The worker now logs the failure to the server log and goes on. The run's own entries were
  wiped with the environment it ran in, so that run cannot be read back.
