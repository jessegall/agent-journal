from journal.features.etiquette.support.etiquette_snapshot import EtiquetteSnapshot
from journal.models.agent import Agent
from journal.repositories.entries import Entries


class EtiquetteSnapshotReader:
    """Reads the etiquette feature's part of the Snapshot for an agent."""

    def __init__(self, entries: Entries) -> None:
        self.entries = entries

    def read(self, agent: Agent) -> EtiquetteSnapshot:
        from journal.features.etiquette.feature import Etiquette
        return EtiquetteSnapshot(lines_since_reminder=self.entries.said_since(agent.session, Etiquette.A_LINE_IS_AN_INSTRUCTION.key))
