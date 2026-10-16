from journal.features.feature import Feature
from journal.features.messages.commands.message_command import MessageCommand
from journal.features.messages.listeners.inbox_at_prompt import InboxAtPrompt
from journal.features.messages.listeners.inbox_at_start import InboxAtStart
from journal.features.messages.listeners.inbox_at_stop import InboxAtStop
from journal.features.messages.listeners.hold_unanswered import HoldUnanswered
from journal.features.messages.listeners.hold_unread import HoldUnread
from journal.features.messages.listeners.inbox_on_arrival import InboxOnArrival
from journal.features.messages.listeners.link_named_tasks import LinkNamedTasks
from journal.features.messages.listeners.record_turn import RecordTurn
from journal.features.messages.listeners.refuse_truncated_read import RefuseTruncatedRead
from journal.features.messages.listeners.run_tags import RunTags
from journal.features.messages.listeners.tell_reaction import TellReaction
from journal.features.nudge import Nudge
from journal.features.option import Option
from journal.features.said import Said
from journal.features.skill import Skill


class Messages(Feature):
    name = "messages"
    title = "Messages"
    help = "A new message is named to the agent by its number, at once and again at start, at a prompt and at a stop; it reads it with the CLI and answers it first."
    commands = (MessageCommand,)
    NUDGE_AFTER = Option("messages.nudge_after", "Ask for an answer after", "Tool uses with a message read and unanswered before the agent is asked to answer it", 0, unit="tool uses")
    HOLD_AFTER = Option("messages.hold_after", "Hold every tool after", "Tool uses with a message read and unanswered before every tool call waits for the answer; 0 holds the first", 0, unit="tool uses")
    REMIND_EVERY = Option("messages.remind_every", "Name the unread inbox every", "Tool uses between namings of an inbox the agent has not read", 3, unit="tool uses")
    HOLD_AFTER_REMINDERS = Option("messages.hold_after_reminders", "Hold the write after", "Namings of an unread inbox before the next write waits until it is read", 5, unit="reminders")
    options = (NUDGE_AFTER, HOLD_AFTER, REMIND_EVERY, HOLD_AFTER_REMINDERS)
    listeners = (InboxAtStart, InboxAtPrompt, InboxAtStop, InboxOnArrival, HoldUnread, HoldUnanswered, RefuseTruncatedRead, RecordTurn, RunTags, TellReaction, LinkNamedTasks)

    NEW = Nudge(name, "new", "new message {{n}}", repeat_after=0, answered_in_chat=True)
    SOME = Nudge(name, "some", "new messages {{ns}}", repeat_after=60, answered_in_chat=True)
    MANY = Nudge(name, "many", "{{count}} messages unread: journal message unread", repeat_after=60, answered_in_chat=True)
    REACTED = Nudge(name, "reacted", "the user put {{face}} on message {{n}}", "act on it if it asks for something, such as a go-ahead; it needs no reply and the chat never mentions it", repeat_after=0)
    ONLY_A_FACE = Nudge(name, "only_a_face", "your turn was only {{face}}, so it was not posted", "a face on its own is a reaction: journal message react <n> \"{{face}}\" puts it on the message it answers; write words when there is something to say", repeat_after=0)
    UNREAD_HELD = Nudge(name, "unread_held", "your inbox is unread: {{count}} waiting", "journal message unread before any other write", repeat_after=0)
    ANSWER = Nudge(name, "answer", "answer message {{messages}} before you do anything else", "a reply with [!reply:N]; a face answers only a message of a few words", repeat_after=300, answered_in_chat=True)
    ANSWER_HELD = Nudge(name, "answer_held", "your tool calls are held: answer message {{messages}} first", "a reply with [!reply:N] in words; a face answers only a message of a few words; only a journal command and a look at the message's own files go through", repeat_after=0, answered_in_chat=True)
    WHOLE = Nudge(name, "whole", "read the user's words whole: no pipe after journal message read or journal question show", "run it on its own; every word is for you", repeat_after=0)
    nudges = (NEW, SOME, MANY, REACTED, ONLY_A_FACE, UNREAD_HELD, ANSWER, ANSWER_HELD, WHOLE)

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

- Read a message whole: `journal message read N` on its own, never piped into head, tail or grep; a piped read is refused.
- The journal names a message by its number, never its words: `new message 4`, `new messages 4, 5, 6`, or past three
  `7 messages unread: journal message unread`. `journal message read N` shows one and marks it read; `journal message unread`
  shows every unread one and marks them read.
- Answer each as a gentleman would, because you were asked: in your next turn, before the work it brought, with the
  tag `[!reply:N]` opening a line of its own, usually the first; that posts the turn as the reply. Nothing holds your
  hands for it: the next tool call waits. Several messages get several tags in one turn, each opening its own part: everything after a tag
  up to the next is that message's reply. `[!reply:N,M]` answers both with one part. A tag inside a line is only text.
- Every message read is one of two things: steering, which you take as steering, or something to do, which you file
  as a task from it, `journal task create "<title>" --from N`, so the chat shows the task above the message.
- A message that only needs acknowledging ("ok", "thanks", "carry on") gets a face, not words: `journal message react N "👍"`,
  🙏 for thanks; the same face again takes it off. The user's face on a message is acted on when it asks for something and
  never mentioned. A turn of yours that is only a face is not posted.
- An unread inbox is named again every third tool use; after five reminders the next write waits until you read it. A message
  you read and leave unanswered holds your very next tool call that is not a journal command or a look at its files: a word
  first, then the work. A face answers only a message of a few words.
- After a compaction, a fresh start or a takeover, `journal environment here` shows what is in flight, the latest
  messages among it, and is owed before any other write; `journal message recent` shows the latest messages alone.
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
