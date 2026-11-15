from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanStalledMessage(MessageTemplate):
    """The agent message plans.plan_stalled."""

    key = "plans.plan_stalled"
    type = AgentMessageType.NOTICE
    text = "plan {plan}: no task can start; {count} are waiting or blocked{waits}"
    turn_limited = False
