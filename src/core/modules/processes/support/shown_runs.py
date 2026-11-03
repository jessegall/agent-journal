from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart


class ShownRuns:
    """The one place that decides whether a run leaves a chat mark and a docked card, the same for every agent: a
    test run, a build, and whatever the journal itself starts show, and no other command does."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def part(self, process: Process) -> ProcessPart | None:
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=process.id).oldest().all_rows())
        shown = next((part for part in parts if part.category.is_long_running), None)
        return shown or (parts[0] if parts and process.creator_id != process.agent_id else None)

    def shows(self, process: Process) -> bool:
        return self.part(process) is not None
