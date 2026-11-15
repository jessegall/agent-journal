from core.modules.drivers.commands.support.wake_agent_handler import WakeAgentHandler
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent import WakeSafeguardsStoppedAgent
from core.modules.drivers.nudges.safeguards_stopped_message import SafeguardsStoppedMessage

WAKE_SOURCE = "drivers.safeguards_stopped"


class WakeSafeguardsStoppedAgentHandler(WakeAgentHandler[WakeSafeguardsStoppedAgent]):
    """Saves the wake line for the agent and types it, with the lines that wait."""

    command = WakeSafeguardsStoppedAgent
    wake_nudge = SafeguardsStoppedMessage.declared()
    wake_source = WAKE_SOURCE
