from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class ReadNextMerge(Command[str]):
    """The merger reads the next worker waiting, with its tasks, proofs and log lines."""
