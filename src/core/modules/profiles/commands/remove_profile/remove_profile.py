from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class RemoveProfile(Command[str]):

    lock = False
    name: str
