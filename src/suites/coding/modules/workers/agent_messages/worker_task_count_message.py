from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskCountMessage(MessageTemplate):
    """The agent message workers.started_task_count."""

    key = "workers.started_task_count"
    type = AgentMessageType.STEERING
    text = "You hold {count} of the {limit} tasks you may hold at once"
    turn_limited = False
