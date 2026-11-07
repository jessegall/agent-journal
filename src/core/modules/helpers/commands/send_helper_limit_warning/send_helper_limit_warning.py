from dataclasses import dataclass

from core.base.command.command import Command

LIMIT_WARNING_SOURCE = "helpers.limit-warning"


@dataclass(frozen=True)
class SendHelperLimitWarning(Command[None]):
    """Tells a parent its helper is near a limit."""

    lock = False

    helper_id: int
    parent_id: int
    job_id: int
    limit_name: str

    @staticmethod
    def source(job_id: int) -> str:
        return f"{LIMIT_WARNING_SOURCE}:{job_id}"
