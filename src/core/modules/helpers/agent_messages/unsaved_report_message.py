from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class UnsavedReportMessage(MessageTemplate):
    """The agent message helpers.unsaved-report: a hand-in whose save failed refuses the stop once (doc 1310 section 4.9)."""

    key = "helpers.unsaved-report"
    type = AgentMessageType.STEERING
    text = "Your hand-in was not saved: stop again."
