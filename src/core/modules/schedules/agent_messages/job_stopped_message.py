from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class JobStoppedMessage(MessageTemplate):
    """The agent message schedules.job_stopped."""

    key = "schedules.job_stopped"
    type = AgentMessageType.STEERING
    text = "The user stopped scheduled job {job}: delete it with CronDelete, id {job}"
