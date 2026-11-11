# @righteous architecture_agents_launcher_reached_outside_the_dispatcher
from core.modules.agents.support.agent_standing import AgentStanding


class ReportArrivalText:
    """Says in one line whether an agent's report reaches its parent at once."""

    def __init__(self, standings: AgentStanding) -> None:
        self.standings = standings

    def text(self) -> str:
        return "its report wakes you" if self.standings.is_launcher_running else "its report arrives at your next hook"
