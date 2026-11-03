from core.modules.processes.support.test_listings import TestListings
from dataclasses import replace

from core.modules.processes.support.process_nudges import RUNNER_MISSING
from collections.abc import Mapping, Sequence

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.command_effect import CommandEffect
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_limit import ForegroundLimit
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine

BACKGROUND_FLAG = "run_in_background"


class RunnerRewriteRule(DriverRule):
    """A shell line of any agent runs through the journal's runner: the run is made a process, split into its
    parts, and the agent's command is rewritten to hand the runner its process, its limit and its line. The
    line stays as written, a read's pipes too; only a test run or a build shows a mark or a card."""

    name = "processes.runner-rewrite"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    history = True
    overlay_proof = True

    def __init__(self, limits: ForegroundLimit, runner: RunnerBinary, hook_history: HookHistory, listings: TestListings) -> None:
        self.limits, self.runner, self.hook_history, self.listings = limits, runner, hook_history, listings

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        if not self.runner.is_installed():
            return self.missing(hook)
        decided = self.limits.decide(hook.environment_id, shell)
        run = replace(decided, queued=hook.role is AgentRole.WORKER and decided.seconds > 0 and not self.is_read_write(shell), read_command=shell.is_readonly)
        return RuleAnswer.allowed().running(StartProcess.build(hook, shell, run)).rewriting_after_commands(lambda results: self.tool_input(hook, shell, run, results))

    def is_read_write(self, shell: ShellLine) -> bool:
        return bool(shell.parts) and all(part.classification.category.accesses_files and CommandEffect.RUNS_LONG not in part.classification.effects for part in shell.parts)

    def tool_input(self, hook: AgentHook, shell: ShellLine, run: ForegroundRun, results: Sequence[object]) -> Mapping[str, object]:
        process = next((made for made in results if isinstance(made, Process)), None)
        if process is None:
            return {}
        run = replace(run, count_line=self.listings.line(process))
        kept = {str(field): value for field, value in hook.event.tool_input().items() if field != BACKGROUND_FLAG}
        return {**kept, "command": RunnerLine.build(self.runner.path, process.id, run, shell.runner_text, hook.event.subagent or hook.event.session)}

    def missing(self, hook: AgentHook) -> RuleAnswer:
        if self.hook_history.last_answer(self.name, hook) is not None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(RUNNER_MISSING.nudge(folder=self.runner.path.parent))
