from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class EndHelperJob(Command[None]):
    """Ends a helper's job as its helper ends."""

    job_id: int
    returned: str = ""
