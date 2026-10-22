from journal.models.outgoing_change import OutgoingChange
from journal.repositories.repository import Repository
from journal.support.actor import Actor


class OutgoingChanges(Repository[OutgoingChange]):
    """The writes waiting for the team server, oldest first; a write to a row whose change still waits is folded into it, never into one being sent."""

    model = OutgoingChange

    def queued(self, change: OutgoingChange, actor: Actor) -> None:
        waiting = self.all_matching(row_table=change.row_table, row=change.row, is_sending=False)
        if not waiting:
            self.save(change, actor)
            return
        merged = waiting[0].merged(change)
        if merged is None:
            self.delete(waiting[0], actor)
        else:
            self.save(merged, actor)

    def waiting(self) -> list[OutgoingChange]:
        return self.all_matching(is_sending=False)
