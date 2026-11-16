from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentsRenumberedMessage(MessageTemplate):
    """The agent message agents.renumber-summary: what the renumber of agents kept and removed, said once to the
    main agent."""

    key = "agents.renumber-summary"
    type = AgentMessageType.STEERING
    text = "Agents renumbered: {stayed} stay (main agent 1, the others from 2 in the order of their old ids), {removed} removed; copy at {copy}."
    turn_limited = False
    path_fields = ("copy",)
