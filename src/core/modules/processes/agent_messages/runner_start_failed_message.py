from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RunnerStartFailedMessage(MessageTemplate):
    """The agent message processes.runner_start_failed."""

    key = "processes.runner_start_failed"
    type = AgentMessageType.STEERING
    text = "the journal could not start a run for this shell line, so it did not run: run it again"
