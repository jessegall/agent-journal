from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentRenumberedMessage(MessageTemplate):
    """The agent message agents.renumbered: an agent's new id after the renumber of agents, said once."""

    key = "agents.renumbered"
    type = AgentMessageType.STEERING
    text = "Agents were renumbered: you are now agent:{agent}, which was agent:{other}."
    turn_limited = False
