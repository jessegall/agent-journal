from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MergerStaleWorktreeMessage(MessageTemplate):
    """The nudge workers.worktree_behind."""

    key = "workers.worktree_behind"
    type = AgentMessageType.STEERING
    text = "worker:{worker} is {count} commits behind its base branch"
    turn_limited = False
    wakes_agent = True
