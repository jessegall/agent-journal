from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecordOverviewRead(Command[None]):
    """Records that the agent read the overview of a command for a target."""

    command_name: str
    target: str
