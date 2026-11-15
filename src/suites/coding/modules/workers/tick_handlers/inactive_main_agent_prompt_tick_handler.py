from engine.ticker.tick_handler import TickHandler
from suites.coding.modules.workers.ticks.inactive_main_agent_prompt import InactiveMainAgentPrompt
from engine.ticker.tick_interval import TickInterval


class InactiveMainAgentPromptTickHandler(TickHandler):
    """The tick handler of InactiveMainAgentPrompt."""

    interval = TickInterval(seconds=60)
    handler = InactiveMainAgentPrompt()
    name = "idle main agent wake"
