from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class ChooseExecutionPreset(Command[str]):
    """Sets each lane's capacity and a starter's share from a machine preset; a capacity changed later is kept."""

    name: str
