---
name: journal-messages
description: Read and answer the user's messages and ask the user questions; read it before the first message command of a session
---

# Messages

The user sends messages; you answer them before anything else.

## Reading

A line typed into your terminal starts with `[journal]`: the journal typed it, not the user.

- `new message N` means message N waits: read it with `journal message read N`, on its own.
- `K new messages` means several wait: read them all with `journal message unread`.
- `message N updated` means the user changed a message you read: read it again with `journal message show N`.
- `journal message read N` prints the text, then `reply on:`, `comment on:` and `links:` when the message has them, and
  marks it read. Those lines tell you what the message is about: follow them before you act.
- `journal message show N` prints the whole row and marks nothing read. It is refused on a message you have not read.
- A stop is refused while a message is unread, and writes wait once the countdown ends.
- A message with a picture asks you to look: open the file, then `journal message tag N "<file>" "<what it shows>"`.

## Answering

- Answer each message at once, before the work it led to.
- Reply with `journal message reply N '<text>'`, single-quoted, then go on with the work in the same turn.
- Never write a reply as your turn's closing text when you go on working: it ends the turn.
- Every message you read is steering, which you follow, or work, which you file with `journal task make`.
- A message that needs nothing more ("ok", "thanks") gets a reaction, not words: `journal message react N "👍"`.
- A comment on a document, report or plan is answered and written into that text; it becomes work only when asked.
- Write a number that names a row with its type, task 3399 or plan 1032, so the chat links it.
- Say in the chat only what the user needs to know.

## Questions

A choice only the user can make is asked as a question, not written into a reply.

- `journal question ask "<title>" --context "<sentences>" --options "a" "b" --recommend "b"`: each choice is quoted on its
  own, and `--recommend` names your choice word for word. You are then waiting, and stopping is fine.
- A question must read on its own, by someone who has not seen your work. The title is a short line of up to 60
  characters that names the decision, such as `Which database?`; the command refuses a longer one. `--context` is
  required and is a few plain sentences: what is being decided, why it came up, and what each option means. Name the
  thing in full words instead of a task number or a name only you know. Keep the details in the context, not the title.
- Each option says who acts, the agent or the user.
- `journal question list` shows what is open, and `journal question show N` shows one with its answer.
