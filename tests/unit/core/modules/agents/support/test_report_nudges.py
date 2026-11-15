from core.modules.agents.nudges.parent_report_message import ParentReportMessage
from engine.enums.line_delivery import LineDelivery


def test_the_parent_report_nudge_uses_the_wake_hook():
    nudge = ParentReportMessage.declared()
    assert nudge.wakes_agent and nudge.delivery is LineDelivery.WAKE_HOOK
