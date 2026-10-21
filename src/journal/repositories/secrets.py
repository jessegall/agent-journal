from journal.models.secret import Secret
from journal.repositories.repository import Repository


class Secrets(Repository[Secret]):
    model = Secret

    def live(self) -> list[Secret]:
        return [s for s in self.all() if s.deleted_at is None]

    def gone(self) -> list[Secret]:
        return [s for s in self.all() if s.deleted_at is not None]
