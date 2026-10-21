from dataclasses import dataclass

from journal.events.journal_updated import JournalUpdated
from journal.models.model import Model


@dataclass(frozen=True)
class JournalVersion(Model):
    """The version the journal last started on; starting on another one is the journal having been updated."""

    version: str = ""

    def started(self, version: str) -> "JournalVersion":
        if version == self.version:
            return self
        return self.with_(version=version).with_event(JournalUpdated(previous=self.version, current=version))
