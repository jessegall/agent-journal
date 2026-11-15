from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ConflictOpenMessage(MessageTemplate):
    """The agent message workers.worktree_clash_open."""

    key = "workers.worktree_clash_open"
    type = AgentMessageType.STEERING
    text = "worker:{worker} update left conflict markers open: read them and advise it once"
    turn_limited = False
    wakes_agent = True
    full_text = True
