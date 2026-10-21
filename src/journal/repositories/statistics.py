from journal.support.actor import Actor
from journal.models.statistic import Statistic
from journal.repositories.repository import Repository


class Statistics(Repository[Statistic]):
    model = Statistic

    def lower(self, prefix: str) -> dict[str, int]:
        return {row.key: row.value for row in self.selected(self.query().filter_prefix("key", prefix).order("key"))}

    def counted(self, key: str, actor: Actor) -> Statistic:
        return self.added(key, 1, actor)

    def added(self, key: str, amount: int, actor: Actor) -> Statistic:
        with self.connection.transaction():
            row = self.series(key)
            return self.save(row.with_(value=row.value + amount), actor)

    def measured(self, prefix: str, ms: int, actor: Actor) -> None:
        with self.connection.transaction():
            self.added(f"{prefix}.count", 1, actor)
            self.added(f"{prefix}.total_ms", ms, actor)
            slowest = self.series(f"{prefix}.slowest_ms")
            if ms > slowest.value:
                self.save(slowest.with_(value=ms), actor)

    def cleared(self, prefix: str, actor: Actor) -> None:
        with self.connection.transaction():
            for row in self.selected(self.query().filter_prefix("key", prefix)):
                self.delete(row, actor)

    def set(self, key: str, value: int, actor: Actor) -> Statistic:
        with self.connection.transaction():
            return self.save(self.series(key).with_(value=value), actor)

    def series(self, key: str) -> Statistic:
        rows = self.matching(key=key)
        return rows[0] if rows else Statistic(key=key)
