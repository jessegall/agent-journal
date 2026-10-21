from journal.models.notice import Notice
from journal.repositories.scoped_repository import ScopedRepository


class Notices(ScopedRepository[Notice]):
    model = Notice

    def unseen_by_user(self) -> int:
        return self.count("closed_at IS NULL AND (created_by IS NULL OR created_by NOT LIKE 'user:%')")

    def open_count(self) -> int:
        return self.count("closed_at IS NULL")

    def open_in(self) -> list[Notice]:
        return [n for n in self.scoped() if n.closed_at is None]
