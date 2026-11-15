from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanWaitingMessage(MessageTemplate):
    """The agent message plans.plan_waiting."""

    key = "plans.plan_waiting"
    type = AgentMessageType.NOTICE
    text = "Plan {plan} is ready: a user approves it on its plan card"
    turn_limited = False
