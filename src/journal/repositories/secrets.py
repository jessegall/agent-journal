from journal.models.secret import Secret
from journal.repositories.repository import Repository


class Secrets(Repository[Secret]):
    model = Secret

    def active(self) -> list[Secret]:
        return [s for s in self.all() if s.deleted_at is None]

    def retired(self) -> list[Secret]:
        return [s for s in self.all() if s.deleted_at is not None]
