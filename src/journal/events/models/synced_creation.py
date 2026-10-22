from dataclasses import dataclass

from journal.events.models.synced import Synced


@dataclass(frozen=True)
class SyncedCreation(Synced):
    """A row another machine created reached this one."""
