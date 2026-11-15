from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class PlainBlockMessage(MessageTemplate):
    """The nudge tasks.plain_block."""

    key = "tasks.plain_block"
    type = AgentMessageType.STEERING
    text = "Block with --on {targets} or --until; a plain reason waits on a user"
    turn_limited = False
