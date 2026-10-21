from journal.features.etiquette.support.etiquette_data import EtiquetteData
from journal.models.agent import Agent
from journal.repositories.entries import Entries


class EtiquetteDataReader:
    """Reads the etiquette feature's part of the feature data for an agent."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def read(self, agent: Agent) -> EtiquetteData:
        from journal.features.etiquette.feature import Etiquette
        return EtiquetteData(lines_since_reminder=self.entries.said_since(agent.session, Etiquette.A_LINE_IS_AN_INSTRUCTION.key))
