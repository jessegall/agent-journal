from journal.support.actor import Actor
from journal.models.statistic import Statistic
from journal.repositories.repository import Repository


class Statistics(Repository[Statistic]):
    model = Statistic

    def under(self, prefix: str) -> dict[str, int]:
        """Every statistic whose key starts with the prefix, by key; one never counted is not there."""
        return {row.key: row.value for row in self.selected("key >= ? AND key < ? ORDER BY key", (prefix, prefix + "\uffff"))}

    def counted(self, key: str, by: Actor) -> Statistic:
        """One more, read and written under the write lock."""
        with self.connection.transaction():
            return self.save(self.of(key).with_(value=self.of(key).value + 1), by)

    def measured(self, prefix: str, ms: int, by: Actor) -> None:
        with self.connection.transaction():
            self.save(self.of(f"{prefix}.count").with_(value=self.of(f"{prefix}.count").value + 1), by)
            self.save(self.of(f"{prefix}.total_ms").with_(value=self.of(f"{prefix}.total_ms").value + ms), by)
            slowest = self.of(f"{prefix}.slowest_ms")
            if ms > slowest.value:
                self.save(slowest.with_(value=ms), by)

    def cleared(self, prefix: str, by: Actor) -> None:
        with self.connection.transaction():
            for row in self.selected("key >= ? AND key < ?", (prefix, prefix + "\uffff")):
                self.delete(row, by)

    def set(self, key: str, value: int, by: Actor) -> Statistic:
        with self.connection.transaction():
            return self.save(self.of(key).with_(value=value), by)

    def of(self, key: str) -> Statistic:
        """The statistic of that key, a fresh one at zero before anything counted it."""
        found = self.where(key=key)
        return found[0] if found else Statistic(key=key)
