from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UpdateReminderMessage(MessageTemplate):
    """The nudge workers.worktree_update_reminder."""

    key = "workers.worktree_update_reminder"
    type = AgentMessageType.STEERING
    text = "reminder: update your worktree at your next stopping point; {count} commits behind your base branch"
    turn_limited = False
    wakes_agent = True
