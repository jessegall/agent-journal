from core.modules.drivers.commands.support.wake_agent_handler import WakeAgentHandler
from core.modules.drivers.commands.wake_safeguards_stopped_agent.wake_safeguards_stopped_agent import WakeSafeguardsStoppedAgent
from core.modules.drivers.support.driver_nudges import SAFEGUARDS_STOPPED

WAKE_SOURCE = "drivers.safeguards_stopped"


class WakeSafeguardsStoppedAgentHandler(WakeAgentHandler[WakeSafeguardsStoppedAgent]):
    """Saves the wake line for the agent and types it, with the lines that wait."""

    command = WakeSafeguardsStoppedAgent
    wake_nudge = SAFEGUARDS_STOPPED
    wake_source = WAKE_SOURCE
