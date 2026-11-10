from engine.enums.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_wildcard import HookWildcard
from core.base.driver.nudge import Nudge
from core.base.driver.rule_answer import RuleAnswer
from core.base.timestamp import Timestamp
from core.modules.processes.models.process import Process
from core.modules.processes.queries.process_query import ProcessQuery
from core.modules.processes.support.output_folder import OutputFolder
from core.modules.processes.support.process_nudges import SILENT_RUN, SILENT_SAVED_PACKAGES, SILENT_SAVED_RUN, STALLED_RUN
from core.modules.processes.support.silent_runs import SILENT_SECONDS, SilentRuns
from core.modules.processes.support.streaming_hints import StreamingHints

STALLED_SECONDS = 300
RUNS_CHECKED = 5


class SilentRunRule(DriverRule):
    """Tells an agent that a test, a build or a Python run still going has printed nothing, or has gone quiet
    long after its last line, so its reader has nothing to show, and how to make that tool print as it runs.
    It checks the agent's newest runs only, so a hook's read stays small however many are going."""

    name = "processes.silent-run"
    roles = [AgentRole.MAIN]
    hook = HookWildcard.ALL_HOOKS
    drivers = ["*"]

    def __init__(self, processes: ProcessQuery, folder: OutputFolder, silent_runs: SilentRuns) -> None:
        self.processes, self.folder, self.silent_runs = processes, folder, silent_runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not hook.event.accepts_lines:
            return RuleAnswer.allowed()
        running = self.processes.agent(hook.agent_id).running().moved().minimum_age(hook.timestamp, SILENT_SECONDS).newest().limited(RUNS_CHECKED)
        return RuleAnswer.with_nudges(*(nudge for process in running if (nudge := self.silent_run_nudge(process, hook.timestamp))))

    def silent_run_nudge(self, process: Process, timestamp: Timestamp) -> Nudge | None:
        part = self.silent_runs.silent_part(process, timestamp)
        if part is None:
            return None
        command = part.command or part.text
        if self.silent_runs.is_empty_output(part):
            if part.saved_command:
                declaration = SILENT_SAVED_PACKAGES if StreamingHints.is_serial_packages_run(command) else SILENT_SAVED_RUN
                return declaration.nudge(name=part.saved_command, seconds=SILENT_SECONDS)
            return SILENT_RUN.nudge(output=process.id, seconds=SILENT_SECONDS, hint=StreamingHints.hint(command))
        if self.folder.silent_seconds(process.id, part.position, timestamp) >= STALLED_SECONDS:
            return STALLED_RUN.nudge(output=process.id, seconds=STALLED_SECONDS, hint=StreamingHints.hint(command))
        return None
