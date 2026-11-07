from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class SendMergeFindings(Command[None]):
    """The merger sends the judge's findings on a merge back to the worker that wrote the work."""

    worker_id: int
    findings: str
