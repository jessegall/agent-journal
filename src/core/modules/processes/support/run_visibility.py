from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.query.query import Query
from engine.database.kept_rows import KeptRows
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

VISIBLE_PARTS_REASON = "every part of the runs asked about decides how each run shows"
KEPT_PARTS = "processes.visible_parts"
KEPT_RUN_PARTS = "processes.visible_parts_of_runs"

class RunVisibility:
    """Uses declared command visibility to choose the chat mark and output card."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries = queries
        self.kept = kept

    # The part a run shows its mark and card by.
    def visible_part(self, process: Process) -> ProcessPart | None:
        return self.select_visible_part(process, self.shown_parts(process))

    # The parts of a run that its readers look at: a merge the journal ran itself has none, read from its row.
    def shown_parts(self, process: Process) -> tuple[ProcessPart, ...]:
        return () if process.is_journal_merge else self.parts(process.id)

    @staticmethod
    def select_visible_part(process: Process, parts: tuple[ProcessPart, ...]) -> ProcessPart | None:
        if process.plugin or process.is_merge_hook:
            return None
        categorized = next((part for part in parts if part.is_visible), None)
        if categorized is not None:
            return categorized
        if parts and process.creator_id != process.session_agent_id:
            return parts[0]
        if process.moved_at is None:
            return None
        return next((part for part in parts if not part.category.accesses_files), None)

    def parts(self, process_id: int) -> tuple[ProcessPart, ...]:
        parts = self.queries.query(ProcessPart).filter(process_id=process_id).oldest()
        return self.kept.read(parts, lambda: tuple(parts.every_row(VISIBLE_PARTS_REASON)), name=KEPT_PARTS)

    # The parts of every run asked about, read once and kept, so each run's mark reads its own from memory.
    def keep_parts(self, process_ids: tuple[int, ...]) -> None:
        for process_id, parts in self.processes_parts(process_ids).items():
            self.kept.read(self.queries.query(ProcessPart).filter(process_id=process_id).oldest(), lambda parts=parts: parts, name=KEPT_PARTS)

    def processes_parts(self, process_ids: tuple[int, ...]) -> dict[int, tuple[ProcessPart, ...]]:
        rows = self.queries.query(ProcessPart).matching(Among("process_id", process_ids)).oldest()
        return self.kept.read(rows, lambda: self.grouped_parts(rows, process_ids), name=KEPT_RUN_PARTS)

    @staticmethod
    def grouped_parts(rows: Query[ProcessPart], process_ids: tuple[int, ...]) -> dict[int, tuple[ProcessPart, ...]]:
        parts: dict[int, list[ProcessPart]] = {process_id: [] for process_id in process_ids}
        for part in rows.every_row(VISIBLE_PARTS_REASON):
            parts[part.process_id].append(part)
        return {process_id: tuple(found) for process_id, found in parts.items()}

    def is_visible(self, process: Process) -> bool:
        return self.visible_part(process) is not None
