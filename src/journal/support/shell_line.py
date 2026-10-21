from dataclasses import dataclass

from journal.support.operation import Operation
from journal.support.reads import Reads
from journal.support.writes import Writes


@dataclass(frozen=True)
class ShellLine(Operation):
    """A shell command the agent is about to run, as one line."""

    kind = "shell line"
    command: str

    def line(self) -> str:
        return self.command

    def writes(self) -> bool:
        return Writes.build(self.command)

    def target_paths(self) -> tuple[str, ...]:
        return tuple(Writes.targets(self.command))

    def read_paths(self) -> tuple[str, ...]:
        return Reads.build(self.command)
