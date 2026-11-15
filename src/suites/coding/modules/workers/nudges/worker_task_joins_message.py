from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerTaskJoinsMessage(MessageTemplate):
    """The nudge workers.task_joins_unit."""

    key = "workers.task_joins_unit"
    type = AgentMessageType.STEERING
    text = "task:{task} joins your unit; to merge it early, commit it and ask with --up-to {task}"
    turn_limited = False
    id_field = "task"
