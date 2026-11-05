from core.base.caller.process_row import ProcessRow
from core.base.caller.process_table import ProcessTable


CHAIN_LIMIT_STEPS = 32


class ProcessChain:
    """The processes from one pid up to the first process, read from one look at the process table, at most
    CHAIN_LIMIT_STEPS of them."""

    def __init__(self, table: ProcessTable) -> None:
        self.table = table

    def steps(self, pid: int) -> list[ProcessRow]:
        rows = {row.pid: row for row in self.table.rows()}
        chain: list[ProcessRow] = []
        while pid in rows and len(chain) < CHAIN_LIMIT_STEPS and all(step.pid != pid for step in chain):
            chain.append(rows[pid])
            pid = rows[pid].parent_pid
        return chain
