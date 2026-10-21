from journal.features.migration.support.migration_snapshot import MigrationSnapshot
from journal.models.agent import Agent
from journal.support.version_3_backup import Version3Backup


class MigrationSnapshotReader:
    """Reads the migration feature's part of the Snapshot for an agent."""

    def __init__(self, backup: Version3Backup) -> None:
        self.backup = backup

    def read(self, agent: Agent) -> MigrationSnapshot:
        return MigrationSnapshot(version_3_waiting=self.backup.is_waiting())
