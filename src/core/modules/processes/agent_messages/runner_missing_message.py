from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class RunnerMissingMessage(MessageTemplate):
    """The agent message processes.runner_missing."""

    key = "processes.runner_missing"
    type = AgentMessageType.STEERING
    text = "journal-run is not installed in {folder}: shell lines run as written and are not kept"
