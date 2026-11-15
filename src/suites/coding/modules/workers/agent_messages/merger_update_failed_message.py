from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergerUpdateFailedMessage(MessageTemplate):
    """The agent message workers.worktree_update_failed."""

    key = "workers.worktree_update_failed"
    type = AgentMessageType.STEERING
    text = "worker:{worker} update failed and changed nothing: journal behind-check show {check} says why"
    turn_limited = False
    wakes_agent = True
    full_text = True
