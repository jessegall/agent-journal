from features.base import Feature
from features.journal import Journal
from features.starting_agents.commands import Launch
from features.starting_agents.details import StartingAgentsDetails


class StartingAgents(Feature):
    details = StartingAgentsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("environment", Launch())
