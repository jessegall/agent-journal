from journal.models.version3_migration import Version3Migration
from journal.repositories.repository import Repository


class Version3Migrations(Repository[Version3Migration]):
    model = Version3Migration

    def current(self) -> Version3Migration:
        return next(iter(self.selected(self.query().order_descending("id").limit(1))), Version3Migration())
