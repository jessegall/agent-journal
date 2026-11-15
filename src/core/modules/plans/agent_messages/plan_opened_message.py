from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanOpenedMessage(MessageTemplate):
    """The nudge plans.plan_opened."""

    key = "plans.plan_opened"
    type = AgentMessageType.STEERING
    text = "plan:{plan} is open again: the plans it waited on have ended"
    turn_limited = False
