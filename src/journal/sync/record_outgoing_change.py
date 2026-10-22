from journal.db.schema import Schema
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.models.outgoing_change import CREATED, DELETED, UPDATED, OutgoingChange
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.sync.team_account import TeamAccount

ACTIONS = {Created: CREATED, Updated: UPDATED, Deleted: DELETED}
STAMP_COLUMNS = ("updated_at", "updater")


class RecordOutgoingChange(Listener[ModelEvent]):
    """Every write to a shared row is queued for the team server in the write's own transaction, once this journal has joined a team: a creation with all its columns, an update with the ones it changed, a deletion with none."""

    def __init__(self, changes: OutgoingChanges, account: TeamAccount) -> None:
        self.changes, self.account = changes, account

    def handle(self, event: ModelEvent) -> None:
        action = ACTIONS.get(type(event))
        if action is None or not event.model.shared or not self.account.is_joined():
            return
        names = self.names(event, action)
        fields = Schema.stored_values(event.model, names)
        updated_at = event.model.updated_at.timestamp()
        self.changes.queued(OutgoingChange(row_table=event.model.table(), row=event.model.row_id, action=action, fields=fields, changed_at={name: updated_at for name in fields}, writer=event.actor.stamp), event.actor)

    @staticmethod
    def names(event: ModelEvent, action: str) -> tuple[str, ...] | None:
        if action == DELETED:
            return ()
        if action == UPDATED:
            return (*event.changed(), *STAMP_COLUMNS)
        return None
