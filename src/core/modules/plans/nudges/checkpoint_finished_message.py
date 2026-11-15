from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CheckpointFinishedMessage(MessageTemplate):
    """The nudge plans.checkpoint_finished."""

    key = "plans.checkpoint_finished"
    type = AgentMessageType.STEERING
    text = "plan {plan}: checkpoint phase {phase} tests passed and later phases are open: tell the user"
    turn_limited = False
