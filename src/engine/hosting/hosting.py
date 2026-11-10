from dataclasses import dataclass

from engine.hosting.hosted_mode import HostedMode
from engine.hosting.local_journal_refusal import LocalJournalRefusal


@dataclass(frozen=True)
class Hosting:
    """Whether this journal is hosted, and the hosted file's choices when it is."""

    hosted_mode: HostedMode | None = None

    @classmethod
    def local(cls) -> "Hosting":
        return cls()

    @classmethod
    def hosted(cls, mode: HostedMode) -> "Hosting":
        return cls(mode)

    @property
    def is_hosted(self) -> bool:
        return self.hosted_mode is not None

    @property
    def mode(self) -> HostedMode:
        if self.hosted_mode is None:
            raise LocalJournalRefusal.has_no_mode()
        return self.hosted_mode
