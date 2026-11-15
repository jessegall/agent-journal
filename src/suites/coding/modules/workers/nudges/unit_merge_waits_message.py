from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnitMergeWaitsMessage(MessageTemplate):
    """The nudge workers.unit_merge_waits."""

    key = "workers.unit_merge_waits"
    type = AgentMessageType.STEERING
    text = "worker:{worker} waits for its unit merge in merge-ask:{merge_ask}; the merger is off"
    wakes_agent = True
