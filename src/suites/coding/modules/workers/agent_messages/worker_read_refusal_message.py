from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerReadRefusalMessage(MessageTemplate):
    """The nudge workers.read_outside_worktree."""

    key = "workers.read_outside_worktree"
    type = AgentMessageType.REFUSAL
    text = "That file is outside your worktree: use what is in your worktree, or ask in your report"
