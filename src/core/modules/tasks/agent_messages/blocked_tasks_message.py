from engine.driver.interval import Interval
from core.modules.drivers.models.support.tool_use_window import ToolUseWindow
from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class BlockedTasksMessage(MessageTemplate):
    """The agent message tasks.blocked_tasks."""

    key = "tasks.blocked_tasks"
    type = AgentMessageType.REFUSAL
    text = "Blocked tasks: {tasks}: unblock what can continue, or stop again to leave them"
    # a second stop with no tool use between leaves them
    interval = Interval(ToolUseWindow(1))
