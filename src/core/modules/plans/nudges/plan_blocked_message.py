from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanBlockedMessage(MessageTemplate):
    """The nudge plans.plan_blocked."""

    key = "plans.plan_blocked"
    type = AgentMessageType.NOTICE
    text = "plan:{plan} is blocked"
    turn_limited = False
