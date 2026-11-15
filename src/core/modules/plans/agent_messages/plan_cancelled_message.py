from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanCancelledMessage(MessageTemplate):
    """The agent message plans.plan_cancelled."""

    key = "plans.plan_cancelled"
    type = AgentMessageType.NOTICE
    text = "plan:{plan} is cancelled"
    turn_limited = False
