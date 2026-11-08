from typing import TYPE_CHECKING, Protocol

if TYPE_CHECKING:
    from core.base.command.external_runs import OutsideRuns


class OutsideWork(Protocol):
    """Work a command needs done with no transaction open, such as a plugin's script, whose answers its next round
    reads."""

    def label(self) -> str: ...

    def run(self, runs: "OutsideRuns") -> None: ...
