from journal.features.feature import Feature
from journal.features.messages.commands.message_command import MessageCommand
from journal.features.messages.listeners.inbox_at_prompt import InboxAtPrompt
from journal.features.messages.listeners.inbox_at_start import InboxAtStart
from journal.features.messages.listeners.inbox_at_stop import InboxAtStop
from journal.features.messages.listeners.inbox_on_arrival import InboxOnArrival
from journal.features.messages.listeners.record_turn import RecordTurn
from journal.features.messages.listeners.run_tags import RunTags
from journal.features.messages.listeners.tell_reaction import TellReaction
from journal.features.nudge import Nudge
from journal.features.said import Said
from journal.features.skill import Skill


class Messages(Feature):
    name = "messages"
    title = "Messages"
    help = "A new message is named to the agent by its number, at once and again at start, at a prompt and at a stop; it reads it with the CLI and answers it first."
    commands = (MessageCommand,)
    listeners = (InboxAtStart, InboxAtPrompt, InboxAtStop, InboxOnArrival, RecordTurn, RunTags, TellReaction)

    NEW = Nudge(name, "new", "new message {{n}}", repeat_after=0)
    SOME = Nudge(name, "some", "new messages {{ns}}", repeat_after=60)
    MANY = Nudge(name, "many", "{{count}} messages unread: journal message unread", repeat_after=60)
    REACTED = Nudge(name, "reacted", "the user put {{face}} on message {{n}}", "act on it if it asks for something, such as a go-ahead; it needs no reply and the chat never mentions it", repeat_after=0)
    ONLY_A_FACE = Nudge(name, "only_a_face", "your turn was only {{face}}, so it was not posted", "a face on its own is a reaction: journal message react <n> \"{{face}}\" puts it on the message it answers; write words when there is something to say", repeat_after=0)
    nudges = (NEW, SOME, MANY, REACTED, ONLY_A_FACE)

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
  turn as the reply. A tag inside a line is only text.
- A message that only needs acknowledging ("ok", "thanks", "carry on") gets a face, not words: `journal message react N "👍"`,
  🙏 for thanks; the same face again takes it off. The user's face on a message is acted on when it asks for something and
  never mentioned. A turn of yours that is only a face is not posted.
- A turn that only answers a journal line and changes nothing is kept out of the chat by itself; say in the chat only what
  the user needs to know.
- Other tags, each opening a line of its own, run the command they stand for with the turn's words as its text:
  `[!todo="the title"]` files a task with the turn as its brief; `[!log:N]` makes the turn task N's log line and keeps it
  out of the chat; `[!end:N]` finishes task N with the turn as what landed; `[!fact="the claim"]`, `[!rule="the ruling"]`
  and `[!reminder="the note"]` record one with the turn as its reason. A tag that cannot run is typed back to you. `journal message send "<text>" --reply-to N` answers from a command; `journal message list` shows the thread,
  unread ones marked with `*`.
- Everything you write for the user reaches the chat as a message; keep it about the work, never about the
  journal's own commands.
""", keywords=('message', 'messages', 'inbox', 'reply'))
