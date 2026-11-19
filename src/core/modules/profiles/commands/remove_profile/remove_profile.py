from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveProfile(Command[str]):

    name: str
