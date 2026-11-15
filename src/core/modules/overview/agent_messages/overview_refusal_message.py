from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OverviewRefusalMessage(MessageTemplate):
    """The nudge overview.overview_first."""

    key = "overview.overview_first"
    type = AgentMessageType.REFUSAL
    text = "Read the overview first"
