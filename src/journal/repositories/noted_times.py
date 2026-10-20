from journal.support.actor import Actor
from journal.models.noted_time import NotedTime
from journal.repositories.scoped_repository import ScopedRepository


class NotedTimes(ScopedRepository[NotedTime]):
    model = NotedTime

    def note(self, name: str, at: float, by: Actor) -> NotedTime:
        """The moment kept under the name, the one before it replaced, in one transaction."""
        with self.connection.transaction():
            rows = self.where(name=name)
            return self.save((rows[0] if rows else NotedTime(name=name)).with_(at=at), by)

    def at(self, name: str) -> float | None:
        """When the name was last noted here; None when it never was."""
        rows = self.where(name=name)
        return rows[0].at if rows else None

    def of_workflow(self, workflow: int) -> dict[str, float]:
        """The times a workflow noted in this environment, by their names."""
        prefix = f"charts:{workflow}:"
        return {t.name[len(prefix):]: t.at for t in self.selected("name LIKE ? ORDER BY id", (f"{prefix}%",))}

    def everywhere_of_workflow(self, workflow: int) -> list[NotedTime]:
        """A workflow's times in every environment, for what ends them all."""
        return self.selected_everywhere("name LIKE ? ORDER BY id", (f"charts:{workflow}:%",))
