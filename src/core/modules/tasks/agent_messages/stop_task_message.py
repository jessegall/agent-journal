from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StopTaskMessage(MessageTemplate):
    """The nudge tasks.task_at_stop."""

    key = "tasks.task_at_stop"
    type = AgentMessageType.REFUSAL
    text = "task:{task} is in hand: continue, block it, or skip this: journal refusal skip tasks.carry-on-at-stop --reason '<why>'"
