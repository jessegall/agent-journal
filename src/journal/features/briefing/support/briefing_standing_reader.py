from journal.features.briefing.support.briefing_standing import BriefingStanding
from journal.models.agent import Agent


class BriefingStandingReader:
    """Reads the briefing feature's part of the Standing for an agent."""

    def read(self, agent: Agent) -> BriefingStanding:
        return BriefingStanding(oriented=agent.oriented)
