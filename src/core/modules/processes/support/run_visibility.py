from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.database.kept_rows import KeptRows
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

class RunVisibility:
    """Uses declared command visibility to choose the chat mark and output card."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries = queries
        self.kept = kept

    def visible_part(self, process: Process) -> ProcessPart | None:
        return self.select_visible_part(process, self.parts(process.id))

    @staticmethod
    def select_visible_part(process: Process, parts: tuple[ProcessPart, ...]) -> ProcessPart | None:
        if process.plugin:
            return None
        categorized = next((part for part in parts if part.is_visible), None)
        if categorized is not None:
            return categorized
        if parts and process.creator_id != process.session_agent_id:
            return parts[0]
        if process.moved_at is None:
            return None
        return next((part for part in parts if not part.category.is_short), None)

    def parts(self, process_id: int) -> tuple[ProcessPart, ...]:
        parts = self.queries.query(ProcessPart).filter(process_id=process_id).oldest()
        return self.kept.read(parts, lambda: tuple(parts.all_rows()), name="processes.visible_parts")

    def processes_parts(self, process_ids: tuple[int, ...]) -> dict[int, tuple[ProcessPart, ...]]:
        parts: dict[int, list[ProcessPart]] = {process_id: [] for process_id in process_ids}
        for part in self.queries.query(ProcessPart).matching(Among("process_id", process_ids)).oldest().all_rows():
            parts[part.process_id].append(part)
        return {process_id: tuple(rows) for process_id, rows in parts.items()}

    def is_visible(self, process: Process) -> bool:
        return self.visible_part(process) is not None
