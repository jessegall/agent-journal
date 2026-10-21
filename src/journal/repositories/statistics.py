from journal.support.actor import Actor
from journal.models.statistic import Statistic
from journal.repositories.repository import Repository


class Statistics(Repository[Statistic]):
    model = Statistic

    def under(self, prefix: str) -> dict[str, int]:
        return {row.key: row.value for row in self.selected("key >= ? AND key < ? ORDER BY key", (prefix, prefix + "\uffff"))}

    def counted(self, key: str, actor: Actor) -> Statistic:
        with self.connection.transaction():
            return self.save(self.of(key).with_(value=self.of(key).value + 1), actor)

    def measured(self, prefix: str, ms: int, actor: Actor) -> None:
        with self.connection.transaction():
            self.save(self.of(f"{prefix}.count").with_(value=self.of(f"{prefix}.count").value + 1), actor)
            self.save(self.of(f"{prefix}.total_ms").with_(value=self.of(f"{prefix}.total_ms").value + ms), actor)
            slowest = self.of(f"{prefix}.slowest_ms")
            if ms > slowest.value:
                self.save(slowest.with_(value=ms), actor)

    def cleared(self, prefix: str, actor: Actor) -> None:
        with self.connection.transaction():
            for row in self.selected("key >= ? AND key < ?", (prefix, prefix + "\uffff")):
                self.delete(row, actor)

    def set(self, key: str, value: int, actor: Actor) -> Statistic:
        with self.connection.transaction():
            return self.save(self.of(key).with_(value=value), actor)

    def of(self, key: str) -> Statistic:
        found = self.matching(key=key)
        return found[0] if found else Statistic(key=key)
