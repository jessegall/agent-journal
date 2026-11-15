from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanApprovedMessage(MessageTemplate):
    """The agent message plans.plan_approved."""

    key = "plans.plan_approved"
    type = AgentMessageType.NOTICE
    text = "Plan {plan} approved"
    turn_limited = False
