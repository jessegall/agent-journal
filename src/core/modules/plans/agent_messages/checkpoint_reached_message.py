from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CheckpointReachedMessage(MessageTemplate):
    """The agent message plans.checkpoint_reached."""

    key = "plans.checkpoint_reached"
    type = AgentMessageType.STEERING
    text = "plan {plan}: phase {phase} is done and is a checkpoint: later phases wait for its tests"
    turn_limited = False
