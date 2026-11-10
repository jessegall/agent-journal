
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from engine.file.file_version import NANOSECONDS
from core.base.driver.rule_answer import RuleAnswer
from engine.file.file_access import FileAccess
from engine.journal.journal_home import JournalHome
from core.base.query.queries import Queries
from engine.instruction.instruction_imports import InstructionImports
from core.modules.drivers.models.hook_call import HookCall
from core.modules.drivers.support.driver_nudges import FILE_LOADED

READ_TOOL = "Read"
PART_FIELDS = ("offset", "limit", "pages")


class RepeatedFileReadRule(DriverRule):
    """Reading a whole file that is still in the agent's context names it: a file the program reads in at
    every start, or one read since the last compaction that has not changed since."""

    name = "drivers.repeated-file-read"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, queries: Queries, home: JournalHome) -> None:
        self.queries, self.home = queries, home

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        tool_input = hook.event.tool_input()
        if tool is None or tool.name != READ_TOOL or any(field in tool_input for field in PART_FIELDS) or not tool.files:
            return RuleAnswer.allowed()
        path = tool.files[0]
        if not self.is_started_with(path) and not self.is_read_unchanged(hook.agent_id, path):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(FILE_LOADED.nudge(path=path))

    def is_started_with(self, path: str) -> bool:
        project = self.home.project_folder
        file = (project / path).resolve()
        main_file = project / "CLAUDE.md"
        return file == main_file.resolve() or main_file.is_file() and any((project / name).resolve() == file for name in InstructionImports.imported_names(main_file))

    def is_read_unchanged(self, agent_id: int, path: str) -> bool:
        compaction = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.COMPACT).descending("id").first()
        reads = self.queries.query(HookCall).filter(session_agent_id=agent_id, hook=HookEventName.PRE_TOOL_USE, tool=READ_TOOL, summary=path).descending("id")
        read = reads.first()
        if read is None or read.created_at is None or compaction is not None and compaction.id > read.id:
            return False
        file = self.home.project_folder / path
        return file.is_file() and FileAccess.shared().version(file).modified_at < read.created_at.value.timestamp() * NANOSECONDS
