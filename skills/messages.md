---
name: journal-messages
description: Read, answer, link and finish messages without confusing acknowledgement, status and durable record.
---

# Messages

Read waiting messages with `journal message unread` and mark one seen with `message read`. Reply when the user needs an answer; react when acknowledgement is enough. When a message contains distinct future work, file the to-do immediately before investigating or implementing it, then record the user's exact words with `message process` so its pill links to the resource. The same immediate filing applies when a message mixes current-work steering with a separate future request.

Finish with `message processed --how`. A status sentence is not a link, and a link is not an answer. File attachments through `message file`; archive only when the message needs no action.
