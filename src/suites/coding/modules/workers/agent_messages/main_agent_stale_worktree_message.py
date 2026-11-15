from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class MainAgentStaleWorktreeMessage(MessageTemplate):
    """The agent message workers.worktree_behind_main."""

    key = "workers.worktree_behind_main"
    type = AgentMessageType.STEERING
    text = "worker:{worker} is {count} commits behind, too far to leave to the merger: decide whether it updates"
    turn_limited = False
    wakes_agent = True
