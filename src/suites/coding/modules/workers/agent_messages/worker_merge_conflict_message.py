from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerMergeConflictMessage(MessageTemplate):
    """The agent message workers.merge_clash."""

    key = "workers.merge_clash"
    type = AgentMessageType.STEERING
    text = "{branch} merged into your worktree and clashes on {lines}: {line}"
    turn_limited = False
    path_fields = ["lines", "line"]
