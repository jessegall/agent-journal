from core.base.query.queries import Queries
from core.base.database.kept_rows import KeptRows
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
        categorized = next((part for part in parts if part.is_visible), None)
        return categorized or (parts[0] if parts and process.creator_id != process.session_agent_id else None)

    def parts(self, process_id: int) -> tuple[ProcessPart, ...]:
        return self.kept.read("process_parts", lambda: tuple(self.queries.query(ProcessPart).filter(process_id=process_id).oldest().all_rows()),
                              "process_id = ?", [process_id], name="processes.visible_parts")

    def is_visible(self, process: Process) -> bool:
        return self.visible_part(process) is not None
