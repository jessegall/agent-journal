from journal.features.feature import Feature
from journal.features.messages.commands.message_command import MessageCommand
from journal.features.messages.listeners.inbox_at_prompt import InboxAtPrompt
from journal.features.messages.listeners.inbox_at_start import InboxAtStart
from journal.features.messages.listeners.inbox_at_stop import InboxAtStop
from journal.features.messages.listeners.record_turn import RecordTurn
from journal.features.nudge import Nudge


class Messages(Feature):
    name = "messages"
    title = "Messages"
    commands = (MessageCommand,)
    listeners = (InboxAtStart, InboxAtPrompt, InboxAtStop, RecordTurn)

    ANSWER = Nudge(name, "answer", "answer these messages before you do anything else: {{messages}}", "reply with [!reply:N] in your turn, or journal message send \"<text>\" --reply-to N", repeat_after=60)
    nudges = (ANSWER,)
