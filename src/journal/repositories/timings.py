from journal.models.timing import Timing
from journal.repositories.repository import Repository
from journal.support.actor import Actor

LOG_ROWS = 1000


class Timings(Repository[Timing]):
    """The newest thousand requests' times to answer, a rolling log: every request logged after its reply, the oldest dropped past the thousand."""

    model = Timing

    def logged(self, timing: Timing, actor: Actor) -> Timing:
        with self.connection.transaction():
            row = self.save(timing, actor)
            self.connection.execute(f"DELETE FROM {self.model.table()} WHERE id <= ?", (row.id - LOG_ROWS,))
        return row

    def recent(self, limit: int) -> list[Timing]:
        return list(reversed(self.newest("1", ())))[:limit]

    def slowest(self, limit: int) -> list[Timing]:
        return self.selected("1 ORDER BY ms DESC, id DESC LIMIT ?", (limit,))

    def slowest_hooks(self, limit: int) -> list[Timing]:
        return self.selected("method = 'HOOK' ORDER BY ms DESC, id DESC LIMIT ?", (limit,))

    def slowest_requests(self, limit: int) -> list[Timing]:
        return self.selected("method != 'HOOK' ORDER BY ms DESC, id DESC LIMIT ?", (limit,))

    def cleared(self, actor: Actor) -> None:
        with self.connection.transaction():
            self.connection.execute(f"DELETE FROM {self.model.table()}")
