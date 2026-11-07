from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecoverApprovals(Command[int]):
    pass
