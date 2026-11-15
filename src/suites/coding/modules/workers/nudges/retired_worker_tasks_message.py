from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RetiredWorkerTasksMessage(MessageTemplate):
    """The nudge workers.retired_with_tasks."""

    key = "workers.retired_with_tasks"
    type = AgentMessageType.STEERING
    text = 'worker:{worker} was retired with {tasks} left: give them to another worker'
    turn_limited = False
    wakes_agent = True
