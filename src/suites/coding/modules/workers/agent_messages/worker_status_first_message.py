from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerStatusFirstMessage(MessageTemplate):
    """The agent message workers.status_first."""

    key = "workers.status_first"
    type = AgentMessageType.REFUSAL
    text = "After a compaction, read your worker status first"
