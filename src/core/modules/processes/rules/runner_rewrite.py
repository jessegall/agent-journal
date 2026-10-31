from collections.abc import Mapping, Sequence

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_history_key import RuleHistoryKey
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.modules.processes.commands.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_limit import ForegroundLimit, ForegroundRun
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine

BACKGROUND_FLAG = "run_in_background"


class RunnerRewrite(DriverRule):
    """Every shell line of a main agent or a worker runs through the journal's runner: the run is made a
    process, and the agent's command is rewritten to hand the runner its process, its limit and its line."""

    name = "processes.runner-rewrite"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]
    history = True

    def __init__(self, limits: ForegroundLimit, runner: RunnerBinary, hook_history: HookHistory) -> None:
        self.limits, self.runner, self.hook_history = limits, runner, hook_history

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        if not self.runner.is_installed():
            return self.missing(hook)
        run = self.limits.decide(hook.environment_id, shell)
        return RuleAnswer.allowed().running(StartProcess.build(hook, shell, run)).rewriting_after_commands(lambda results: self.tool_input(hook, shell, run, results))

    def tool_input(self, hook: AgentHook, shell: ShellLine, run: ForegroundRun, results: Sequence[object]) -> Mapping[str, object]:
        process = next((made for made in results if isinstance(made, Process)), None)
        if process is None:
            return {}
        kept = {str(field): value for field, value in hook.event.tool_input().items() if field != BACKGROUND_FLAG}
        return {**kept, "command": RunnerLine.build(str(self.runner.path), process.id, run, shell.line)}

    def missing(self, hook: AgentHook) -> RuleAnswer:
        if self.hook_history.answer_time(RuleHistoryKey(hook.agent_id, self.name, hook.layer_ref)) is not None:
            return RuleAnswer.allowed()
        return RuleAnswer.with_lines(f"journal-run is not installed in {self.runner.path.parent}, so your shell lines run as you wrote them and are not kept as numbered outputs")
