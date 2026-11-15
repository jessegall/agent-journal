from collections.abc import Sequence
from dataclasses import dataclass

from engine.agent_machine.compiling.driver_table import DriverTable as CompiledTable
from engine.command.command import Command


@dataclass(frozen=True)
class RecordDriverTables(Command[None]):
    """Records the compiled table of each driver whose digest the journal has not recorded yet, for audit."""

    tables: Sequence[CompiledTable]
