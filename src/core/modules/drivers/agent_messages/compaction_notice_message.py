from engine.enums.line_delivery import LineDelivery
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CompactionNoticeMessage(MessageTemplate):
    """The nudge drivers.compaction_notice."""

    key = "drivers.compaction_notice"
    delivery = LineDelivery.WAKE_HOOK
    type = AgentMessageType.STEERING
    text = "agent:{agent} posted context-compaction-notice:{notice}"
    turn_limited = False
    wakes_agent = True
