from types import SimpleNamespace

from core.modules.drivers.bindings.agent_line_nudger import AgentLineNudger
from engine.driver.line_delivery import LineDelivery
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.enums.nudge_type import NudgeType

CONTEXT = SimpleNamespace(actor=SimpleNamespace(id=1))


class SavingRepository:
    def save(self, row, context):
        return row


def test_the_line_keeps_the_declarations_delivery():
    declaration = NudgeDeclaration("sample.wake", NudgeType.NOTICE, "wake up", wakes_agent=True, delivery=LineDelivery.WAKE_HOOK)
    line = AgentLineNudger(SavingRepository()).send_nudge(3, declaration.nudge(), "sample", CONTEXT)  # type: ignore[arg-type]
    assert line.delivery is LineDelivery.WAKE_HOOK and line.wakes_agent


def test_send_text_defaults_to_terminal_typing():
    line = AgentLineNudger(SavingRepository()).send_text(3, "a line", "sample", CONTEXT)  # type: ignore[arg-type]
    assert line.delivery is LineDelivery.TERMINAL_TYPING
