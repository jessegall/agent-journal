from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentRenumberedMessage(MessageTemplate):
    """The agent message agents.renumbered: an agent's new id after the renumber of agents, said once."""

    key = "agents.renumbered"
    type = AgentMessageType.STEERING
    text = "{text}"
    turn_limited = False
    path_fields = ("text",)
    full_text = True
