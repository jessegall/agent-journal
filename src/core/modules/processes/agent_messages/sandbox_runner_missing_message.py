from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class SandboxRunnerMissingMessage(MessageTemplate):
    """The agent message processes.sandbox_runner_missing."""

    key = "processes.sandbox_runner_missing"
    type = AgentMessageType.REFUSAL
    text = "The read-only sandbox needs journal-run: install the runner before running this line"
