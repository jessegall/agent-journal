from dataclasses import dataclass

from journal.features.updates.support.release_message import ReleaseMessage


@dataclass(frozen=True)
class ReleaseNotes:
    """The release messages this environment's agent has not been told yet."""

    messages: tuple[ReleaseMessage, ...] = ()
