from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class WorkerHelperBanMessage(MessageTemplate):
    """The agent message workers.worker_starts_no_helper."""

    key = "workers.worker_starts_no_helper"
    type = AgentMessageType.REFUSAL
    text = "A worker starts no read-only helper here: a user turns on workers-start-read-only-helpers"
