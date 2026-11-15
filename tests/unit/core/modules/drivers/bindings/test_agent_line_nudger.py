from types import SimpleNamespace

from core.modules.drivers.bindings.agent_line_sender import AgentLineSender
from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType

CONTEXT = SimpleNamespace(actor=SimpleNamespace(id=1))


class SavingRepository:
    def save(self, row, context):
        return row


def test_the_line_keeps_the_declarations_delivery():
    declaration = MessageTemplate("sample.wake", AgentMessageType.NOTICE, "wake up", wakes_agent=True, delivery=LineDelivery.WAKE_HOOK)
    line = AgentLineSender(SavingRepository()).send_nudge(3, declaration.nudge(), "sample", CONTEXT)  # type: ignore[arg-type]
    assert line.delivery is LineDelivery.WAKE_HOOK and line.wakes_agent


def test_send_text_defaults_to_terminal_typing():
    line = AgentLineSender(SavingRepository()).send_text(3, "a line", "sample", CONTEXT)  # type: ignore[arg-type]
    assert line.delivery is LineDelivery.TERMINAL_TYPING
