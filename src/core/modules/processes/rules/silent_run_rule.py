from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.models.process_part import ProcessPart
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_RUN, SILENT_SAVED_RUN, STALLED_RUN
from core.modules.processes.support.streaming_hints import StreamingHints

SILENT_SECONDS = 30
STALLED_SECONDS = 300
RUNS_CHECKED = 5
PYTHON_PROGRAM = "python"


class SilentRunRule(DriverRule):
    """Tells an agent that a test, a build or a Python run still going has printed nothing, or has gone quiet
    long after its last line, so its reader has nothing to show, and how to make that tool print as it runs.
    It checks the agent's newest runs only, so a hook's read stays small however many are going."""

    name = "processes.silent-run"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, parts: ProcessPartQuery) -> None:
        self.processes, self.folder, self.parts = processes, folder, parts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        running = self.processes.agent(hook.agent_id).running().moved().minimum_age(hook.timestamp, SILENT_SECONDS).newest().limited(RUNS_CHECKED)
        return RuleAnswer.with_nudges(*(nudge for process in running if (nudge := self.silent_run_nudge(process, hook.timestamp))))

    def silent_run_nudge(self, process: Process, timestamp: Timestamp) -> Nudge | None:
        if self.folder.total_bytes(process.id) and self.folder.run_silent_seconds(process.id, timestamp) < SILENT_SECONDS:
            return None
        part = next((part for part in self.parts.process(process.id).all_rows() if part.ended_at is None), None)
        if part is None or not self.is_watched(part):
            return None
        hint = StreamingHints.hint(part.command or part.text)
        if not self.folder.part_bytes(process.id, part.position):
            if part.saved_command:
                return SILENT_SAVED_RUN.nudge(name=part.saved_command, seconds=SILENT_SECONDS, hint=hint)
            return SILENT_RUN.nudge(output=process.id, seconds=SILENT_SECONDS, hint=hint)
        if self.folder.silent_seconds(process.id, part.position, timestamp) >= STALLED_SECONDS:
            return STALLED_RUN.nudge(output=process.id, seconds=STALLED_SECONDS, hint=hint)
        return None

    @staticmethod
    def is_watched(part: ProcessPart) -> bool:
        return part.category.is_long_running or Path(part.program).name.startswith(PYTHON_PROGRAM)
