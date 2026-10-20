from journal.features.migration.support.migration_standing import MigrationStanding
from journal.models.agent import Agent
from journal.support.version_3_backup import Version3Backup


class MigrationStandingReader:
    """Reads the migration feature's part of the Standing for an agent."""

    def __init__(self, backup: Version3Backup) -> None:
        self.backup = backup

    def read(self, agent: Agent) -> MigrationStanding:
        return MigrationStanding(version_3_waiting=self.backup.is_waiting())
