from journal.support.actor import Actor
from journal.models.noted_time import NotedTime
from journal.repositories.workflow_value_rows import WorkflowValueRows
from journal.support.value_name import ValueName


class NotedTimes(WorkflowValueRows[NotedTime]):
    model = NotedTime

    def note(self, value: ValueName, at: float, by: Actor) -> NotedTime:
        """The moment kept under the workflow's name for it, the one before it replaced, in one transaction."""
        with self.connection.transaction():
            rows = self.where(name=value.stored)
            return self.save((rows[0] if rows else NotedTime(name=value.stored)).with_(at=at), by)

    def forget(self, value: ValueName, by: Actor) -> None:
        for row in self.where(name=value.stored):
            self.delete(row, by)

    def at(self, value: ValueName) -> float | None:
        """When the workflow last noted the time by that name here; None when it never did."""
        rows = self.where(name=value.stored)
        return rows[0].at if rows else None
