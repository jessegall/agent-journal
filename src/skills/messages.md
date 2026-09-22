---
name: journal-messages
description: Read, answer, link and finish messages without confusing acknowledgement, status and durable record.
---

# Messages

Read waiting messages with `journal message unread` and mark one seen with `message read`. **Answer before you write anything.** A message you have read is replied to, reacted to or processed before your next edit, not after the work is done: the user hears what you make of it first, and a one-line reply saying what you are about to do counts. Reading and searching are free while you work out what to say. Reply when the user needs an answer, by opening your turn with `[!reply:<n>]`: when the turn ends, it becomes the reply. React when acknowledgement is enough. When a message contains distinct future work, file the to-do immediately before investigating or implementing it, then record the user's exact words with `message process` so its pill links to the resource. The same immediate filing applies when a message mixes current-work steering with a separate future request.

A message whose every paragraph has been processed into a part closes itself; otherwise finish with `message processed --how`. A status sentence is not a link, and a link is not an answer. File attachments through `message file`; archive only when the message needs no action.
