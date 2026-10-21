from journal.features.migration.support.migration_data import MigrationData
from journal.models.agent import Agent
from journal.features.migration.support.version_3_backup import Version3Backup


class MigrationDataReader:
    """Reads the migration feature's part of the feature data for an agent."""

    def __init__(self, backup: Version3Backup) -> None:
        self.backup = backup

    def read(self, agent: Agent) -> MigrationData:
        return MigrationData(version_3_waiting=self.backup.is_waiting())
