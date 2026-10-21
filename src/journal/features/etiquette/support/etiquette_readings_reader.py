from journal.features.etiquette.support.etiquette_readings import EtiquetteReadings
from journal.models.agent import Agent
from journal.repositories.entries import Entries


class EtiquetteReadingsReader:
    """Reads the etiquette feature's part of the Readings for an agent."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def read(self, agent: Agent) -> EtiquetteReadings:
        from journal.features.etiquette.feature import Etiquette
        return EtiquetteReadings(lines_since_reminder=self.entries.said_since(agent.session, Etiquette.A_LINE_IS_AN_INSTRUCTION.key))
