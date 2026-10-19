from pathlib import Path

from journal.config import Config
from journal.models.actor import Actor
from journal.models.version3_migration import Version3Migration
from journal.repositories.version3_migrations import Version3Migrations


class Version3Backup:
    """The version 3 journal the installer kept whole in .journal/version-3, and whether it is still to be brought across."""

    def __init__(self, config: Config, migrations: Version3Migrations) -> None:
        self.config, self.migrations = config, migrations

    @property
    def folder(self) -> Path:
        return self.config.home / "version-3"

    def is_kept(self) -> bool:
        return self.folder.is_dir()

    def is_waiting(self) -> bool:
        """Kept, and the user has not yet brought it across."""
        return self.is_kept() and self.migrations.current().state.is_open()

    def put_off(self, by: Actor) -> Version3Migration:
        return self.migrations.save(self.migrations.current().put_off(), by)
