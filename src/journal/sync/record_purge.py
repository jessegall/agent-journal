from journal.events.listener import Listener
from journal.events.models.purged import Purged
from journal.models.outgoing_change import DELETED, OutgoingChange
from journal.repositories.outgoing_changes import OutgoingChanges
from journal.sync.team_account import TeamAccount
from journal.sync.commit_signal import CommitSignal


class RecordPurge(Listener[Purged]):
    """Every shared row deleted together with others is queued for the team server as a deletion of its own, so the server's copy keeps no row this machine removed."""

    def __init__(self, changes: OutgoingChanges, account: TeamAccount, signal: CommitSignal) -> None:
        self.changes, self.account, self.signal = changes, account, signal

    def handle(self, event: Purged) -> None:
        if not event.model.shared or not self.account.is_joined():
            return
        for id in event.ids:
            self.changes.queued(OutgoingChange(row_table=event.model.table(), row=id, action=DELETED, fields={}, changed_at={}, writer=event.actor.stamp), event.actor)
        self.changes.commit_callback(self.signal.ring)
