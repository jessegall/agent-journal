from journal.features.feature import Feature
from journal.features.messages.support.messages_data_reader import MessagesDataReader
from journal.features.messages.support.messages_data import MessagesData
from journal.features.messages.messages_conduct import MessagesConduct
from journal.features.messages.listeners.record_typed_prompt import RecordTypedPrompt
from journal.features.messages.listeners.record_peer_message import RecordPeerMessage
from journal.features.messages.listeners.outgoing_message_record import OutgoingMessageRecord
from journal.features.messages.listeners.transcript_scan import TranscriptScan
from journal.features.messages.commands.message_command import MessageCommand
from journal.features.messages.listeners.deliver_message import DeliverMessage
from journal.features.messages.listeners.start_inbox_delivery import StartInboxDelivery
from journal.features.messages.listeners.task_mention_links import TaskMentionLinks
from journal.features.messages.listeners.dump_item_card import DumpItemCard
from journal.features.messages.listeners.inbox_arrival_card import InboxArrivalCard
from journal.features.messages.listeners.record_turn import RecordTurn
from journal.features.messages.listeners.run_tags import RunTags
from journal.engine.nudge import Nudge
from journal.support.option import Option
from journal.support.skill import Skill


class Messages(Feature[MessagesData]):
    ANSWER_REQUEST_LIMIT = Option("messages.nudge_after", "Ask for an answer after", "Tool uses the agent may make after reading a message before it is told the message is still unanswered", 5, unit="tool uses")
    TOOL_BLOCK_LIMIT = Option("messages.hold_after", "Hold every tool after", "Tool uses the agent may make after reading a message before its tools wait for the answer; 0 holds the first", 10, unit="tool uses")
    TRANSCRIPT_SCAN_DELAY = Option("messages.sweep_after", "Look for missed words older than", "Seconds the hooks have to bring the agent's words to the chat before the transcript is looked through for any they missed", 10, unit="seconds")
    EDIT_BLOCK_LIMIT = Option("messages.hold_after_unread", "Hold the write after", "Tool uses the agent may make after a message arrives, each told how many are left, before its next write waits until it reads the message", 5, unit="tool uses")
    name = "messages"
    title = "Messages"
    help = "A new message is named to the agent by its number, at once and again at start, at a prompt and at a stop; it reads it with the CLI and answers it first."
    commands = (MessageCommand,)
    options = (ANSWER_REQUEST_LIMIT, TOOL_BLOCK_LIMIT, EDIT_BLOCK_LIMIT, TRANSCRIPT_SCAN_DELAY)
    listeners = (InboxArrivalCard, TranscriptScan, RecordTypedPrompt, RecordPeerMessage, OutgoingMessageRecord, RecordTurn, RunTags, TaskMentionLinks, DumpItemCard, DeliverMessage, StartInboxDelivery)
    data = (MessagesDataReader,)
    conduct = (MessagesConduct,)

    NEW_MESSAGE = Nudge(name, "new_message_to_answer", "new message {{n}}", repeat_interval=0, chat_answerable=True)
    NEW_MESSAGES = Nudge(name, "new_messages_to_answer", "new messages {{ns}}", repeat_interval=60, chat_answerable=True)
    UNREAD_MESSAGES = Nudge(name, "unread_messages_to_read", "{{count}} messages unread: `journal message unread`", repeat_interval=60, chat_answerable=True)
    USER_REACTION = Nudge(name, "the_user_reacted", "the user put {{face}} on message {{n}}", "act on it if it asks for something, such as a go-ahead; it needs no reply and the chat never mentions it", repeat_interval=0)
    FACE_REPLY = Nudge(name, "reply_was_only_a_face", "your reply was only {{face}}, so it was not posted", "an emoji on its own is a reaction: `journal message react <n> \"{{face}}\"` puts it on the message it answers; write words when there is something to say", repeat_interval=0)
    INBOX_COUNTDOWN = Nudge(name, "writes_held_soon_until_read", "tool uses left before your writes wait for message {{messages}}: {{count}}", "read it now with `journal message unread`", repeat_interval=0, chat_answerable=True)
    INBOX_LAST_USE = Nudge(name, "next_write_held_until_read", "your next write waits for message {{messages}}", "read it now with `journal message unread`", repeat_interval=0, chat_answerable=True)
    UNANSWERED_COUNTDOWN = Nudge(name, "tools_held_soon_until_answered", "tool uses left before your tools wait for your answer to message {{messages}}: {{count}}", "answer or react to it now", repeat_interval=0, chat_answerable=True)
    UNANSWERED_LAST_USE = Nudge(name, "next_tool_held_until_answered", "your next tool call waits for your answer to message {{messages}}", "answer or react to it now", repeat_interval=0, chat_answerable=True)
    INBOX_EDIT_BLOCK = Nudge(name, "write_held_until_read", "you have {{count}} unread messages", "`journal message unread` before any other write", repeat_interval=0)
    UNANSWERED_MESSAGES = Nudge(name, "answer_before_anything_else", "you have not answered message {{messages}} yet", "answer or react to it before you go on; your tools wait once you have gone on long enough", repeat_interval=300, chat_answerable=True)
    UNANSWERED_TOOL_BLOCK = Nudge(name, "tools_held_until_answered", "answer or react to message {{messages}} first", "your tool calls wait until you do", repeat_interval=0, chat_answerable=True)
    FULL_MESSAGE_READ = Nudge(name, "read_the_words_whole", "read the user's words whole: no pipe after `journal message read` or `journal question show`", "run it on its own; every word is for you", repeat_interval=0)
    DUPLICATE_REPLY = Nudge(name, "reply_kept_out_as_replied_already", "message {{n}} already has your reply {{reply}}, so this one was kept out of the chat", "send it again only if it says something new: `journal message send \"<text>\" --reply-to {{n}} --confirm`", repeat_interval=0)
    REPEATED_CLOSING_TEXT = Nudge(name, "closing_words_kept_out_as_repeated", "your closing words said again what your reply {{reply}} to message {{n}} said, so they were kept out of the chat", "a reply goes out once; close with only what is new", repeat_interval=0)
    PEER_QUESTION = Nudge(name, "answer_the_other_agent", "agent {{sender}} asked you a question in message {{n}}", "answer it with SendMessage to {{sender}}; a message from another agent that asks nothing needs no answer", repeat_interval=300)
    nudges = (PEER_QUESTION, NEW_MESSAGE, NEW_MESSAGES, UNREAD_MESSAGES, USER_REACTION, FACE_REPLY, INBOX_EDIT_BLOCK, UNANSWERED_MESSAGES, UNANSWERED_TOOL_BLOCK, FULL_MESSAGE_READ, DUPLICATE_REPLY, REPEATED_CLOSING_TEXT, INBOX_COUNTDOWN, INBOX_LAST_USE, UNANSWERED_COUNTDOWN, UNANSWERED_LAST_USE)

    skill = Skill("messages", "Read and answer the user's messages; load it when there are unread messages or before replying", """
# Messages

The user leaves messages; you answer them before anything else.

- Read a message whole: `journal message read N` on its own, never piped into head, tail or grep; a piped read is refused.
- The journal names a message by its number, never its words: `new message 4`, `new messages 4, 5, 6`, or past three
  `7 messages unread: journal message unread`. `journal message read N` shows one and marks it read; `journal message unread`
  shows every unread one and marks them read.
- Answer each as a gentleman would, because you were asked: in your next turn, before the work it brought. A reply in a
  turn that goes on to call a tool is sent with `journal message send "<text>" --reply-to N`: Claude Code keeps text written
  before a tool call only as a paraphrased thought, so a reply typed there is lost. A turn that ends with your words takes
  the tag `[!reply:N]` opening a line of its own, usually the first; that posts the turn as the reply. Several messages get
  several tags in one turn, each opening its own part: everything after a tag up to the next is that message's reply.
  `[!reply:N,M]` answers both with one part. A tag inside a line is only text.
- Every message read is one of two things: steering, which you take as steering, or something to do, which you file
  as a task from it, `journal task create "<title>" --from N`, so the chat shows the task above the message.
- A message that only needs acknowledging ("ok", "thanks", "carry on") gets a face, not words: `journal message react N "👍"`,
  🙏 for thanks; the same face again takes it off. The user's face on a message is acted on when it asks for something and
  never mentioned. A turn of yours that is only a face is not posted.
- An unread inbox is named again every third tool use; after five reminders the next write waits until you read it. A message
  you read and leave unanswered holds your very next tool call that is not a journal command or a look at its files: a word
  first, then the work. A face on a message answers it too.
- After a compaction, a fresh start or a takeover, `journal environment overview` shows what is in flight, the latest
  messages among it, and is owed before any other write; `journal message recent` shows the latest messages alone.
- A picture in a message is named once you have looked: `journal message tag <n> <file> "<what it shows>"`.
- A turn that only answers a journal line and changes nothing is kept out of the chat by itself; say in the chat only what
  the user needs to know.
- Other tags, each opening a line of its own, run the command they stand for with the turn's words as its text:
  `[!todo="the title"]` files a task with the turn as its brief; `[!log:N]` makes the turn task N's log line and keeps it
  out of the chat; `[!end:N]` finishes task N with the turn as what landed; `[!fact="the claim"]`, `[!rule="the ruling"]`
  and `[!reminder="the note"]` record one with the turn as its reason. A tag that cannot run is typed back to you. `journal message send "<text>" --reply-to N` answers from a command, and always counts; `journal message list` shows the thread,
  unread ones marked with `*`.
- A message from another session's agent reaches the chat as that agent's. Read it at once and act on it as steering;
  answer it, with SendMessage to that agent, only when it asks a question, so two agents never answer each other without end.
- Everything you write for the user reaches the chat as a message; keep it about the work, never about the
  journal's own commands.
""", keywords=('message', 'messages', 'inbox', 'reply'))

    @classmethod
    def inbox(cls, unread: tuple[int, ...]) -> "Nudge":
        if len(unread) == 1:
            return cls.NEW_MESSAGE.create(n=unread[0])
        if len(unread) <= 3:
            return cls.NEW_MESSAGES.create(ns=", ".join(str(n) for n in unread))
        return cls.UNREAD_MESSAGES.create(count=len(unread))

    @classmethod
    def inbox_lines(cls) -> tuple[Nudge, ...]:
        return (cls.NEW_MESSAGE, cls.NEW_MESSAGES, cls.UNREAD_MESSAGES)

    @classmethod
    def inbox_countdown(cls, unread: tuple[int, ...], remaining_uses: int) -> "Nudge":
        numbers = ", ".join(str(n) for n in unread)
        return cls.INBOX_COUNTDOWN.create(count=remaining_uses, messages=numbers) if remaining_uses else cls.INBOX_LAST_USE.create(messages=numbers)

    @classmethod
    def unanswered_countdown(cls, unanswered: tuple[int, ...], remaining_uses: int) -> "Nudge":
        numbers = ", ".join(str(n) for n in unanswered)
        return cls.UNANSWERED_COUNTDOWN.create(count=remaining_uses, messages=numbers) if remaining_uses else cls.UNANSWERED_LAST_USE.create(messages=numbers)
