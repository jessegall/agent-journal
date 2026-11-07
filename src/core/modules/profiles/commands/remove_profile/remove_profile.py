from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RemoveProfile(Command[str]):

    lock = False
    name: str
