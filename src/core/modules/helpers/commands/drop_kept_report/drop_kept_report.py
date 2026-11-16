from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class DropKeptReport(Command[str]):
    """Ends a helper's job whose report could not be saved, with no report, so the helper may take its next job."""

    helper_id: int
