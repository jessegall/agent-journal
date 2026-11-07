from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class StartMerger(Command[None]):
    """Something waits for the merger: it is given the job, or the main agent hears when no merger can start."""

    fallback_line: str
