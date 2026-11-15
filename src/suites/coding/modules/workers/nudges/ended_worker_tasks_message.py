from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class EndedWorkerTasksMessage(MessageTemplate):
    """The nudge workers.ended_with_tasks."""

    key = "workers.ended_with_tasks"
    type = AgentMessageType.STEERING
    text = "worker:{worker} ended with {tasks} left: send it a job, or release them"
    turn_limited = False
    wakes_agent = True
