from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ConflictRepeatedMessage(MessageTemplate):
    """The nudge workers.worktree_clash_still_open."""

    key = "workers.worktree_clash_still_open"
    type = AgentMessageType.STEERING
    text = "worker:{worker} still has conflict markers after your advice: pass it to the main agent"
    turn_limited = False
    wakes_agent = True
    full_text = True
