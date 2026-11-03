from pathlib import Path

from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_part_query import ProcessPartQuery
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_RUN

SILENT_SECONDS = 30
PYTHON_PROGRAM = "python"


class SilentRunRule(DriverRule):
    """Tells an agent that a Python run still going has printed nothing, so its reader has nothing to show, and
    how to make it stream; any other program may print at its end for its own reasons."""

    name = "processes.silent-run"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, parts: ProcessPartQuery) -> None:
        self.processes, self.folder, self.parts = processes, folder, parts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        silent = [process for process in self.processes.agent(hook.agent_id).running().moved().minimum_age(hook.timestamp, SILENT_SECONDS).all_rows()
                  if not self.folder.total_bytes(process.id) and self.runs_python(process.id)]
        return RuleAnswer.with_nudges(*(SILENT_RUN.nudge(output=process.id, seconds=SILENT_SECONDS) for process in silent))

    def runs_python(self, process_id: int) -> bool:
        return any(Path(part.program).name.startswith(PYTHON_PROGRAM) for part in self.parts.process(process_id).all_rows())
