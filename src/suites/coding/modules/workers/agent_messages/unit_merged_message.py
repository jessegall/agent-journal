from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnitMergedMessage(MessageTemplate):
    """The agent message workers.unit_merged."""

    key = "workers.unit_merged"
    type = AgentMessageType.STEERING
    text = "worker:{worker} merged {count} tasks; its note is in merge-ask:{merge_ask}"
    wakes_agent = True
