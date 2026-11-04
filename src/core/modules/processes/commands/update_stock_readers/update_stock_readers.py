from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class UpdateStockReaders(Command[None]):
    pass
