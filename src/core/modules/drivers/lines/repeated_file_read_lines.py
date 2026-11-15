from collections.abc import Sequence
from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_line_source import EventLineSource

from engine.enums.hook_event_name import HookEventName
from engine.file.versions.file_version import NANOSECONDS
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from engine.query.queries import Queries
from engine.instruction.instruction_imports import InstructionImports
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.queries.hook_call_query import HookCallQuery
from core.modules.drivers.nudges.file_loaded_nudge import FileLoadedNudge

READ_TOOL = "Read"
PART_FIELDS = ("offset", "limit", "pages")


class RepeatedFileReadLines(EventLineSource):
    """Reading a whole file that is still in the agent's context names it: a file the program reads in at
    every start, or one read since the last compaction that has not changed since."""

    key = "drivers.repeated-file-read"
    events = [HookEventName.PRE_TOOL_USE]

    def __init__(self, queries: Queries, home: JournalHome, hook_calls: HookCallQuery) -> None:
        self.queries, self.home, self.hook_calls = queries, home, hook_calls

    def nudges(self, event: HookEvent | None, agent_id: int) -> Sequence[Nudge]:
        tool = event.tool
        tool_input = event.tool_input()
        if tool is None or tool.name != READ_TOOL or any(field in tool_input for field in PART_FIELDS) or not tool.files:
            return []
        path = tool.files[0]
        if not self.is_started_with(path) and not self.is_read_unchanged(agent_id, path):
            return []
        return [FileLoadedNudge.declared().nudge(path=path)]

    def is_started_with(self, path: str) -> bool:
        project = self.home.project_folder
        file = (project / path).resolve()
        main_file = project / "CLAUDE.md"
        return file == main_file.resolve() or FileAccess.is_file(main_file) and any((project / name).resolve() == file for name in InstructionImports.imported_names(main_file))

    def is_read_unchanged(self, agent_id: int, path: str) -> bool:
        compaction = self.hook_calls.latest_compaction(agent_id)
        reads = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=READ_TOOL, summary=path).descending("id")
        read = reads.first()
        if read is None or read.created_at is None or compaction is not None and compaction.id > read.id:
            return False
        file = self.home.project_folder / path
        return FileAccess.is_file(file) and FileAccess.version(file).modified_at < read.created_at.value.timestamp() * NANOSECONDS
