from dataclasses import dataclass
from pathlib import Path

from supervisor.supervisor import Supervisor


@dataclass(frozen=True)
class Launch:
    """What was asked for on the command line: which agent, in which project, with which arguments."""

    agent: str
    root: Path
    args: tuple[str, ...]
    environment: str = "main"

    @classmethod
    def parse(cls, argv: list[str]) -> "Launch": ...

    def agent_command(self) -> list[str]: ...

    def journal_command(self) -> list[str]: ...

    def environ(self) -> dict[str, str]: ...

    def supervisor(self) -> Supervisor: ...
