# Messages

Messages are how users and agents talk in the journal.

## Where messages come from

Users write to an agent in the chat window. Each message belongs to one conversation and reaches the agent of that session.

## States

A message is sent, waiting for an answer, answered or dismissed. A message that waits for an answer stays on your stack until you answer it or it is dismissed; a dismissed message waits for nothing.

## Answering

Answer every message that waits for an answer, in the conversation it came from, at once and before the work it led to. Write a record's type with its number, such as task 7, and say in the chat only what the user needs to know. An empty message is refused, and only an actor allowed to write in a conversation can send to it.

## While a chat message waits for you

A user reads the chat, never your terminal. When a chat message is sent to you, an answering state goes on your stack and stays until you have answered in that chat. Messages that arrive meanwhile join the same state.

- Each time you are shown where you stand, it says how many messages wait and how many tool uses you have left before you must answer. The journal's own tools never count and are never refused.
- When the tool uses are used up, every other tool call is refused until you answer.
- Answer with `messages_reply` and the message's id. When a message needs no words, react with `messages_react`: the chat's id, the message's id and an emoji.
- One reply or reaction answers everything that waited in that chat. Give each message that needs an answer of its own a reply of its own.
- If you end your turn with words and no reply, your closing words are posted as your reply to the oldest waiting message.
