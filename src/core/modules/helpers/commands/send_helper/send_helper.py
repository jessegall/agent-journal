from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendHelper(Command[int]):
    """Gives a helper its next job."""

    helper_id: int
    job: str
    steer: bool = False
