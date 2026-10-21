from journal.features.migration.support.migration_readings import MigrationReadings
from journal.models.agent import Agent
from journal.support.version_3_backup import Version3Backup


class MigrationReadingsReader:
    """Reads the migration feature's part of the Readings for an agent."""

    def __init__(self, backup: Version3Backup) -> None:
        self.backup = backup

    def read(self, agent: Agent) -> MigrationReadings:
        return MigrationReadings(version_3_waiting=self.backup.is_waiting())
