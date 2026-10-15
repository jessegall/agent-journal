from journal.features.feature import Feature
from journal.features.messages.commands.message_command import MessageCommand
from journal.features.messages.listeners.inbox_at_prompt import InboxAtPrompt
from journal.features.messages.listeners.inbox_at_start import InboxAtStart
from journal.features.messages.listeners.inbox_at_stop import InboxAtStop
from journal.features.messages.listeners.inbox_on_arrival import InboxOnArrival
from journal.features.messages.listeners.record_turn import RecordTurn
from journal.features.nudge import Nudge
from journal.features.said import Said
from journal.features.skill import Skill


class Messages(Feature):
    name = "messages"
    title = "Messages"
    help = "A new message is named to the agent by its number, at once and again at start, at a prompt and at a stop; it reads it with the CLI and answers it first."
    commands = (MessageCommand,)
    listeners = (InboxAtStart, InboxAtPrompt, InboxAtStop, InboxOnArrival, RecordTurn)

    NEW = Nudge(name, "new", "new message {{n}}", repeat_after=0)
    SOME = Nudge(name, "some", "new messages {{ns}}", repeat_after=60)
    MANY = Nudge(name, "many", "{{count}} messages unread: journal message unread", repeat_after=60)
    nudges = (NEW, SOME, MANY)

    @classmethod
    def inbox(cls, unread: list) -> "Said":
        """The shortest line that names what waits: one by its number, a few by theirs, more than three by their count and the command that prints them."""
        if len(unread) == 1:
            return cls.NEW.about(n=unread[0].id)
        if len(unread) <= 3:
            return cls.SOME.about(ns=", ".join(str(m.id) for m in unread))
        return cls.MANY.about(count=len(unread))

    skill = Skill("messages", "Read and answer the user's messages; load it when there are unread messages or before replying", """
# Messages

The user leaves messages; you answer them before anything else.

- The journal names a message by its number, never its words: `new message 4`, `new messages 4, 5, 6`, or past three
  `7 messages unread: journal message unread`. `journal message read N` shows one and marks it read; `journal message unread`
  shows every unread one and marks them read.
- Answer each in your next turn with the tag `[!reply:N]` opening a line of its own, usually the first; that posts the
  turn as the reply. A tag inside a line is only text. `journal message send "<text>" --reply-to N` answers from a command; `journal message list` shows the thread,
  unread ones marked with `*`.
- Everything you write for the user reaches the chat as a message; keep it about the work, never about the
  journal's own commands.
""", keywords=('message', 'messages', 'inbox', 'reply'))
