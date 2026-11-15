from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class OverviewLineMessage(MessageTemplate):
    """The nudge overview.run_overview."""

    key = "overview.run_overview"
    type = AgentMessageType.STEERING
    text = "Read the overview"
    turn_limited = False
