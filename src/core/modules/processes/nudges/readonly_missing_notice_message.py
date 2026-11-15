from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class ReadonlyMissingNoticeMessage(MessageTemplate):
    """The nudge processes.read_only_missing_readers."""

    key = "processes.read_only_missing_readers"
    type = AgentMessageType.STEERING
    text = "{count} commands run by read-only helpers have no proper reader"
