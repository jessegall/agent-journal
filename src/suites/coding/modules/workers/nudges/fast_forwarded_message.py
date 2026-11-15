from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class FastForwardedMessage(MessageTemplate):
    """The nudge workers.worktree_fast_forwarded."""

    key = "workers.worktree_fast_forwarded"
    type = AgentMessageType.STEERING
    text = "your worktree moved up to its base branch; nothing of yours was touched"
    turn_limited = False
