from journal.features.etiquette.support.etiquette_standing import EtiquetteStanding
from journal.models.agent import Agent
from journal.repositories.entries import Entries


class EtiquetteStandingReader:
    """Reads the etiquette feature's part of the Standing for an agent."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def read(self, agent: Agent) -> EtiquetteStanding:
        from journal.features.etiquette.feature import Etiquette
        return EtiquetteStanding(lines_since_reminder=self.entries.said_since(agent.session, Etiquette.A_LINE_IS_AN_INSTRUCTION.key))
