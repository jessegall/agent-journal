from core.modules.messages.commands.record_message_updated_line.record_message_updated_line_handler import IDLE_MESSAGE_SOURCE, UPDATED_SOURCE
from types import SimpleNamespace

from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line_handler import RecordMessageUpdatedLineHandler
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES

MESSAGE = SimpleNamespace(id=12, type=next(iter(PERSON_MESSAGE_TYPES)), read_at="2026-11-15T09:00:00+00:00")


class OneMessage:
    def query(self, model):
        return self

    def filter(self, **fields):
        return self

    def first(self):
        return MESSAGE


class RecordedMessageSender:
    def __init__(self) -> None:
        self.sent: list[tuple[object, str]] = []

    def send(self, agent_id, declaration, source, context, **values):
        self.sent.append((declaration, source))


class AgentTurn:
    def __init__(self, is_idle: bool) -> None:
        self.is_idle = is_idle

    def has_ended_turn(self, agent_id: int) -> bool:
        return self.is_idle


class Recipient:
    def recipient(self, message):
        return SimpleNamespace(id=3)


def message_source(is_idle: bool) -> str:
    message_sender = RecordedMessageSender()
    RecordMessageUpdatedLineHandler(OneMessage(), message_sender, AgentTurn(is_idle), Recipient()).handle(RecordMessageUpdatedLine(12), None)  # type: ignore[arg-type]
    return message_sender.sent[0][1]


def test_an_updated_message_for_an_idle_agent_is_a_line_typed_into_its_terminal_and_one_in_a_turn_waits_for_its_hook():
    assert (message_source(True), message_source(False)) == (IDLE_MESSAGE_SOURCE, UPDATED_SOURCE)
