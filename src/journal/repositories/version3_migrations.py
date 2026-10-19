from journal.models.version3_migration import Version3Migration
from journal.repositories.repository import Repository


class Version3Migrations(Repository[Version3Migration]):
    model = Version3Migration

    def current(self) -> Version3Migration:
        """The project's one migration: its row once the user has acted on it, a fresh offer before that."""
        return next(iter(self.selected("1 ORDER BY id DESC LIMIT 1")), Version3Migration())
