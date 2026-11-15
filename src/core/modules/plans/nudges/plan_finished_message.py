from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlanFinishedMessage(MessageTemplate):
    """The nudge plans.plan_finished."""

    key = "plans.plan_finished"
    type = AgentMessageType.STEERING
    text = "Plan {plan} done: run the full suite; merging to main and releasing wait for the user's go-ahead"
    turn_limited = False
