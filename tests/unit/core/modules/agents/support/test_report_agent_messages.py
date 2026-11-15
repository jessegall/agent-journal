from core.modules.agents.agent_messages.parent_report_message import ParentReportMessage
from engine.enums.line_delivery import LineDelivery


def test_the_parent_report_agent_message_uses_the_wake_hook():
    agent_message = ParentReportMessage.declared()
    assert agent_message.wakes_agent and agent_message.delivery is LineDelivery.WAKE_HOOK
