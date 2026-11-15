from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class TaskBriefFirstMessage(MessageTemplate):
    """The nudge tasks.brief_first."""

    key = "tasks.brief_first"
    type = AgentMessageType.REFUSAL
    text = "Read task {task} first"
