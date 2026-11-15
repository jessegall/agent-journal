from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanContextMessage(MessageTemplate):
    """The agent message plans.start_context."""

    key = "plans.start_context"
    type = AgentMessageType.STEERING
    text = "Plan {plan} started: read its context before changing project files"
    turn_limited = False
