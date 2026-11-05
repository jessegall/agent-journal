from core.base.caller.process_table import ProcessTable
from core.base.caller.process_row import ProcessRow


class FixedProcessTable(ProcessTable):
    """A process table a story writes itself, empty until it does, so a story never reads the machine's
    processes."""

    def __init__(self, rows: list[ProcessRow]) -> None:
        self.fixed_rows = rows

    def rows(self) -> list[ProcessRow]:
        return self.fixed_rows
