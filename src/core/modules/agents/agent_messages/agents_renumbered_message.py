from engine.driver.message_template import MessageTemplate
from engine.enums.agent_message_type import AgentMessageType


class AgentsRenumberedMessage(MessageTemplate):
    """The agent message agents.renumber-summary: what the renumber of agents kept and removed, said once to the
    main agent."""

    key = "agents.renumber-summary"
    type = AgentMessageType.STEERING
    text = "Agents renumbered: {kept} stay, the main agent first as 1; {count} removed; copy at {path}."
    turn_limited = False
    path_fields = ("path",)
