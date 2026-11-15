from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UpdateOrderedMessage(MessageTemplate):
    """The nudge workers.worktree_update_ordered."""

    key = "workers.worktree_update_ordered"
    type = AgentMessageType.STEERING
    text = "Your base branch moved {count} commits: update your worktree at your next stopping point."
    turn_limited = False
    wakes_agent = True
    full_text = True
