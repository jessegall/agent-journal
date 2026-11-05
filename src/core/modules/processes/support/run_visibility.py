from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

class RunVisibility:
    """Uses declared command visibility to choose the chat mark and output card."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def visible_part(self, process: Process) -> ProcessPart | None:
        parts = self.queries.query(ProcessPart).filter(process_id=process.id).oldest().all_rows()
        categorized = next((part for part in parts if part.is_visible), None)
        return categorized or (parts[0] if parts and process.creator_id != process.agent_id else None)

    def is_visible(self, process: Process) -> bool:
        return self.visible_part(process) is not None
