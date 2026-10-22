from journal.db.query import Query
from journal.models.timing import Timing
from journal.repositories.repository import Repository
from journal.support.actor import Actor

LOG_ROWS = 1000
HOOK = "HOOK"


class Timings(Repository[Timing]):
    """The newest thousand requests' times to answer, a rolling log: every request logged after its reply, the oldest dropped past the thousand."""

    model = Timing

    def logged(self, timing: Timing, actor: Actor) -> Timing:
        with self.connection.transaction():
            row = self.save(timing, actor)
            self._purged(self.query().filter_less_equal("id", row.row_id - LOG_ROWS))
        return row

    def recent(self, limit: int) -> list[Timing]:
        return list(reversed(self.newest(self.query())))[:limit]

    def slowest(self, limit: int) -> list[Timing]:
        return self.selected(self.slowest_first().limit(limit))

    def slowest_hooks(self, limit: int) -> list[Timing]:
        return self.selected(self.slowest_first().filter(method=HOOK).limit(limit))

    def slowest_requests(self, limit: int) -> list[Timing]:
        return self.selected(self.slowest_first().filter_unequal("method", HOOK).limit(limit))

    def cleared(self, actor: Actor) -> None:
        with self.connection.transaction():
            self._purged(self.query())

    def slowest_first(self) -> Query:
        return self.query().order_descending("ms").order_descending("id")
