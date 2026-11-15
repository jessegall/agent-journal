from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanApprovalNoteMessage(MessageTemplate):
    """The agent message plans.plan_approved_message."""

    key = "plans.plan_approved_message"
    type = AgentMessageType.NOTICE
    text = "Plan {plan} approved with a message: read message {message} before starting"
    turn_limited = False
