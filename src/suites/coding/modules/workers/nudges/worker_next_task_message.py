from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerNextTaskMessage(MessageTemplate):
    """The nudge workers.next_task."""

    key = "workers.next_task"
    type = AgentMessageType.STEERING
    text = "Your tests passed. Next: task:{task}. {line}"
    turn_limited = False
    path_fields = ["line"]
