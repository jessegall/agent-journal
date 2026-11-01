from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.rule_answer import RuleAnswer
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_RUN

SILENT_SECONDS = 30


class SilentRunRule(DriverRule):
    """Tells an agent that a run still going has printed nothing, so its reader has nothing to show, and how
    to make it stream."""

    name = "processes.silent-run"
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, processes: ProcessQuery, folder: OutputFolder) -> None:
        self.processes, self.folder = processes, folder

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        silent = [process for process in self.processes.agent(hook.agent_id).running().moved().all_rows()
                  if process.creation_timestamp().elapsed_seconds(hook.timestamp) >= SILENT_SECONDS and not self.folder.total_bytes(process.id)]
        return RuleAnswer.with_nudges(*(SILENT_RUN.nudge(output=process.id, seconds=SILENT_SECONDS) for process in silent))
