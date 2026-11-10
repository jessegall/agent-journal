from dataclasses import dataclass

from engine.command.command import Command


@dataclass(frozen=True)
class CloseUserApproval(Command[object]):
    arguments: tuple[str, ...]
    reason: str = ""
