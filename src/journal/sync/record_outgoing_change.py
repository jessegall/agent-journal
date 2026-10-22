from journal.db.schema import Schema
from journal.events.listener import Listener
from journal.events.models.created import Created
from journal.events.models.deleted import Deleted
from journal.events.models.model_event import ModelEvent
from journal.events.models.updated import Updated
from journal.models.outgoing_change import CREATED, DELETED, UPDATED, OutgoingChange
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.sync.team_account import TeamAccount
from journal.sync.setting_scopes import SettingScopes
from journal.models.model import Model
from journal.models.setting import Setting

ACTIONS = {Created: CREATED, Updated: UPDATED, Deleted: DELETED}
STAMP_COLUMNS = ("updated_at", "updater")


class RecordOutgoingChange(Listener[ModelEvent]):
    """Every write to a shared row is queued for the team server in the write's own transaction, once this journal has joined a team, a setting only when it is the team's: a creation with all its columns, an update with the ones it changed, a deletion with none."""

    def __init__(self, changes: OutgoingChanges, account: TeamAccount, scopes: SettingScopes) -> None:
        self.changes, self.account, self.scopes = changes, account, scopes

    def handle(self, event: ModelEvent) -> None:
        action = ACTIONS.get(type(event))
        if action is None or not self.is_team_row(event.model) or not self.account.is_joined():
            return
        names = self.names(event, action)
        fields = Schema.stored_values(event.model, names)
        updated_at = event.model.updated_at.timestamp()
        self.changes.queued(OutgoingChange(row_table=event.model.table(), row=event.model.row_id, action=action, fields=fields, changed_at={name: updated_at for name in fields}, writer=event.actor.stamp), event.actor)

    def is_team_row(self, model: Model) -> bool:
        return model.shared and (not isinstance(model, Setting) or self.scopes.is_team(model.key))

    @staticmethod
    def names(event: ModelEvent, action: str) -> tuple[str, ...] | None:
        if action == DELETED:
            return ()
        if action == UPDATED:
            return (*event.changed(), *STAMP_COLUMNS)
        return None
