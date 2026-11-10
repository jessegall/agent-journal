from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RecordJobNewSession(Command[None]):
    """Records that a helper's job began a new program session, where it was sent to resume one."""

    job_id: int
