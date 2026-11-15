from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class StartRulesMessage(MessageTemplate):
    """The agent message project_rules.start_rules."""

    key = "project_rules.start_rules"
    type = AgentMessageType.STEERING
    text = "{count} project rules apply: read them"
    turn_limited = False
