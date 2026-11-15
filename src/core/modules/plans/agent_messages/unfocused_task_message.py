from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnfocusedTaskMessage(MessageTemplate):
    """The nudge plans.unfocused_task."""

    key = "plans.unfocused_task"
    type = AgentMessageType.NOTICE
    text = "Task {task} belongs to plan {plan}; your focus is plan {focus}"
    turn_limited = False
