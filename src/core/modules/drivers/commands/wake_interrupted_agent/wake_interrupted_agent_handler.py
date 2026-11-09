from core.modules.drivers.commands.support.wake_agent_handler import WakeAgentHandler
from core.modules.drivers.commands.wake_interrupted_agent.wake_interrupted_agent import WakeInterruptedAgent
from core.modules.drivers.support.driver_nudges import AGENT_INTERRUPTED

WAKE_SOURCE = "drivers.interrupted"


class WakeInterruptedAgentHandler(WakeAgentHandler[WakeInterruptedAgent]):
    """Saves the wake line for the agent and types it, with the lines that wait."""

    command = WakeInterruptedAgent
    wake_nudge = AGENT_INTERRUPTED
    wake_source = WAKE_SOURCE
