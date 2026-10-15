from journal.models.notice import Notice
from journal.repositories.scoped_repository import ScopedRepository


class Notices(ScopedRepository[Notice]):
    model = Notice

    def open_in(self, environment_id: int) -> list[Notice]:
        return [n for n in self.in_(environment_id) if n.closed_at is None]
