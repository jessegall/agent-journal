from core.base.driver.command_category import CommandCategory
from core.base.query.queries import Queries
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart

VISIBLE_CATEGORIES = (CommandCategory.TEST_RUN, CommandCategory.BUILD)
MERGE_COMMAND = "journal worker merge"


class RunVisibility:
    """Decides whether a run leaves a chat mark and a docked card, the same for every agent: a test run, a build, a
    worker's merge, and whatever the journal itself starts are visible, and no other command is."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def visible_part(self, process: Process) -> ProcessPart | None:
        parts = tuple(self.queries.query(ProcessPart).filter(process_id=process.id).oldest().all_rows())
        categorized = next((part for part in parts if part.category in VISIBLE_CATEGORIES or part.text.startswith(MERGE_COMMAND)), None)
        return categorized or (parts[0] if parts and process.creator_id != process.agent_id else None)

    def is_visible(self, process: Process) -> bool:
        return self.visible_part(process) is not None
