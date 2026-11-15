from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class CheckpointFailureFallbackMessage(MessageTemplate):
    """The agent message workers.checkpoint_failure_fallback."""

    key = "workers.checkpoint_failure_fallback"
    type = AgentMessageType.STEERING
    text = "A failed test of checkpoint phase:{phase} names no task: task:{task} was sent back, output {outputs}"
    turn_limited = False
