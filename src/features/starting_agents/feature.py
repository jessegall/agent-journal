from features.base import Feature
from features.journal import Journal
from features.starting_agents.commands import Launch
from features.starting_agents.details import StartingAgentsDetails
from features.starting_agents.handlers import WakeOnMessage


class StartingAgents(Feature):
    details = StartingAgentsDetails

    def register(self, journal: Journal) -> None:
        journal.commands.add("environment", Launch())
        journal.events.handler(WakeOnMessage())
