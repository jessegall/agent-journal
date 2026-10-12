"""What answers the Providers service: the agents this journal can run, and what each one's driver knows.

A controller used to reach up into this package from inside a write, which is how it came to know which
flags a provider takes and where its conversation file is. It asks here instead, by type.
"""

from pathlib import Path

from providers import DRIVERS, PROVIDERS, workspace_folders
from providers.transcripts import TRANSCRIPT_PAGE, NoTranscript, Transcript, paged, whole
from serving import SERVED, Providers


class TheProviders:
    """The providers this journal runs agents on."""

    def named(self) -> tuple[str, ...]:
        """Every provider that can be asked for, for a refusal that lists them."""
        return tuple(DRIVERS)

    def knows(self, name: str) -> bool:
        return name in DRIVERS

    def driver(self, name: str):
        """How an agent of that provider is launched, resumed and typed to."""
        return DRIVERS[name]

    def of(self, name: str):
        """The provider itself, which reads its transcripts and knows its models."""
        return PROVIDERS[name]()

    def offers(self, name: str):
        return PROVIDERS[name]() if name in PROVIDERS else None

    def workspaces(self) -> tuple[str, ...]:
        """The folders a workspace of any provider keeps beside a checkout, which a worktree carries over."""
        return workspace_folders()

    def conversation(self, record, provider: str, transcript: str, since: int, before: int, last: int, entry: int) -> dict:
        """A page of an agent's own conversation, read from the file its provider recorded."""
        found = Transcript(self.of(provider), Path(transcript)) if provider in PROVIDERS and transcript and Path(transcript).is_file() else NoTranscript()
        return whole(found, record, entry) if entry else paged(found, since, before, last or TRANSCRIPT_PAGE)


SERVED.answered(Providers, TheProviders())
