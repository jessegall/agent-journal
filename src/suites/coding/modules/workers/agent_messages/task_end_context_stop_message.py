from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskEndContextStopMessage(MessageTemplate):
    """The nudge workers.context_stop_between_tasks."""

    key = "workers.context_stop_between_tasks"
    type = AgentMessageType.STEERING
    text = "Your context passed the limit between tasks: stop now; stopping compacts it and you continue after"
    turn_limited = False
