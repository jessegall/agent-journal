from types import SimpleNamespace

from core.modules.messages.commands.record_message_updated_line.record_message_updated_line import RecordMessageUpdatedLine
from core.modules.messages.commands.record_message_updated_line.record_message_updated_line_handler import RecordMessageUpdatedLineHandler
from core.modules.messages.models.enums.message_type import PERSON_MESSAGE_TYPES
from engine.enums.line_delivery import LineDelivery

MESSAGE = SimpleNamespace(id=12, type=next(iter(PERSON_MESSAGE_TYPES)), read_at="2026-11-15T09:00:00+00:00")


class OneMessage:
    def query(self, model):
        return self

    def filter(self, **fields):
        return self

    def first(self):
        return MESSAGE


class RecordedNudger:
    def __init__(self) -> None:
        self.sent: list[tuple[object, str]] = []

    def send(self, agent_id, declaration, source, context, **values):
        self.sent.append((declaration, source))


class AgentTurn:
    def __init__(self, between_turns: bool) -> None:
        self.between_turns = between_turns

    def has_ended_turn(self, agent_id: int) -> bool:
        return self.between_turns


class Recipient:
    def recipient(self, message):
        return SimpleNamespace(id=3)


def sent(between_turns: bool) -> tuple[LineDelivery, str]:
    nudger = RecordedNudger()
    RecordMessageUpdatedLineHandler(OneMessage(), nudger, AgentTurn(between_turns), Recipient()).handle(RecordMessageUpdatedLine(12), None)  # type: ignore[arg-type]
    declaration, source = nudger.sent[0]
    return declaration.delivery, source  # type: ignore[attr-defined]


def test_an_idle_message_line_uses_the_wake_hook():
    assert sent(between_turns=True) == (LineDelivery.WAKE_HOOK, "messages.idle")


def test_a_message_line_in_a_turn_keeps_terminal_typing():
    assert sent(between_turns=False) == (LineDelivery.TERMINAL_TYPING, "messages.updated")
