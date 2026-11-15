from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UpdateSkippedMessage(MessageTemplate):
    """The nudge workers.worktree_update_not_run."""

    key = "workers.worktree_update_not_run"
    type = AgentMessageType.STEERING
    text = "worker:{worker} has not run the ordered update"
    turn_limited = False
    wakes_agent = True
