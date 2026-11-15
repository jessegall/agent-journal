from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class GraphifyFirstMessage(MessageTemplate):
    """The nudge tools.graphify_first."""

    key = "tools.graphify_first"
    type = AgentMessageType.REFUSAL
    text = "{count} searches without Graphify: first run graphify query with 2 to 4 code names, then explain one"
    turn_limited = False
