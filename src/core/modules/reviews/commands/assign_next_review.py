from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class AssignNextReview(Command[None]):
    """Gives the oldest queued review of an environment to its oldest idle reviewer, if there is both."""

    environment_id: int
