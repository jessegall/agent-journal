from engine.actor.actor import Actor
from engine.command.bus import Bus
from core.modules.agents.commands.start_agent_program.start_agent_program import StartAgentProgram
from core.modules.agents.models.enums.dispatch import Dispatch
from core.modules.agents.support.agent_standing import AgentStanding

PROGRAM_LINE = ("claude", "-p", "Read src/cart.py")


class SampleSuiteStart:
    """What a made-up suite does to start one of its agents and to read whether it runs: the public command and
    the public query of the agents module, and nothing of the launcher."""

    def __init__(self, bus: Bus, standings: AgentStanding) -> None:
        self.bus, self.standings = bus, standings

    def start(self, agent_id: int, folder: str) -> Dispatch:
        return self.bus.run(StartAgentProgram(agent_id, PROGRAM_LINE, folder), Actor.core(), environment_id=1)

    def is_running(self, agent_id: int) -> bool:
        return self.standings.standing(agent_id).is_running
