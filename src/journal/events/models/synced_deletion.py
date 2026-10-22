from dataclasses import dataclass

from journal.events.models.synced import Synced


@dataclass(frozen=True)
class SyncedDeletion(Synced):
    """A row another machine deleted was deleted here."""
