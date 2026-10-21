from journal.models.journal_version import JournalVersion
from journal.repositories.repository import Repository


class JournalVersions(Repository[JournalVersion]):
    model = JournalVersion

    def current(self) -> JournalVersion | None:
        rows = self.rows()
        return rows[0] if rows else None
