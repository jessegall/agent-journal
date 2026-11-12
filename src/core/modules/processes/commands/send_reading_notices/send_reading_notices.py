from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class SendReadingNotices(Command[None]):
    """Tells the agent of a run whose output has all its text how to read such a run better."""

    process_id: int
