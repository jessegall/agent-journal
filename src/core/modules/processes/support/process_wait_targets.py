from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from engine.query.queries import Queries
from core.base.registry.registry import Registry
from core.modules.processes.models.process import Process
from core.modules.processes.queries.output_query import OutputQuery
from core.modules.waits.support.wait_targets import WaitTargets


class ProcessWaitTargets(WaitTargets):
    """Wait targets with the output word for a process, and what an ended output says in the refusal of a wait
    on it: how it ended, with its exit code, and the summary its reader wrote."""

    aliases = {"output": "processes"}

    def __init__(self, registry: Registry, tables: Tables, queries: Queries, book: StateBook, outputs: OutputQuery) -> None:
        super().__init__(registry, tables, queries, book)
        self.outputs = outputs

    def result(self, row: Model, reference: str) -> str:
        if not isinstance(row, Process):
            return super().result(row, reference)
        outcome = row.ending_phrase()
        kept = self.outputs.process_output(row.id)
        digest = f"; summary: {kept.reader_summary}" if kept is not None and kept.reader_summary else ""
        return f"output {row.id} {outcome}{digest}"
