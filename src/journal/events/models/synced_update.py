from dataclasses import dataclass

from journal.events.models.synced import Synced


@dataclass(frozen=True)
class SyncedUpdate(Synced):
    """A change another machine made to a row reached this one."""
