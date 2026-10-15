from journal.features.feature import Feature
from journal.features.messages.commands.message_command import MessageCommand
from journal.features.messages.listeners.inbox_at_prompt import InboxAtPrompt
from journal.features.messages.listeners.inbox_at_start import InboxAtStart
from journal.features.messages.listeners.inbox_at_stop import InboxAtStop
from journal.features.messages.listeners.inbox_on_arrival import InboxOnArrival
from journal.features.messages.listeners.record_turn import RecordTurn
from journal.features.nudge import Nudge
from journal.features.skill import Skill


class Messages(Feature):
    name = "messages"
    title = "Messages"
    help = "Your unread messages are put before the agent at start, at a prompt and at a stop, and it answers them first."
    commands = (MessageCommand,)
    listeners = (InboxAtStart, InboxAtPrompt, InboxAtStop, InboxOnArrival, RecordTurn)

    ANSWER = Nudge(name, "answer", "answer these messages before you do anything else: {{messages}}", "reply with [!reply:N] in your turn, or journal message send \"<text>\" --reply-to N", repeat_after=60)
    ARRIVED = Nudge(name, "arrived", "there is a new message in your inbox, {{n}}", "journal message read {{n}} takes it in; answer it before anything else", repeat_after=0)
    nudges = (ANSWER, ARRIVED)

    skill = Skill("messages", "Read and answer the user's messages; load it when there are unread messages or before replying", """
# Messages

The user leaves messages; you answer them before anything else.

- When the journal lists unread messages, answer each one in your next turn with the tag `[!reply:N]` at the
  start of the paragraph that answers message N; that posts the reply and marks N read.
- A message that arrives while you sit at your prompt is named by its number on a `[journal]` line: `journal message read N`
  shows its words and marks it read; then answer it.
- `journal message send "<text>" --reply-to N` answers from a command; `journal message list` shows the thread,
  unread ones marked with `*`.
- Everything you write for the user reaches the chat as a message; keep it about the work, never about the
  journal's own commands.
""", keywords=('message', 'messages', 'inbox', 'reply'))
