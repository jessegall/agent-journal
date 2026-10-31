from collections.abc import Mapping, Sequence

from core.base.agent_role import AgentRole
from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.shell_line import ShellLine
from core.modules.processes.commands.start_process import StartProcess
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_limit import ForegroundLimit, ForegroundRun
from core.modules.processes.support.runner_line import RunnerLine

BACKGROUND_FLAG = "run_in_background"


class RunnerRewrite(DriverRule):
    """Every shell line of a main agent or a worker runs through the journal's runner: the run is made a process,
    and the agent's command is rewritten to hand the runner its process, its limit and its line."""

    name = "processes.runner-rewrite"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN, AgentRole.WORKER]

    def __init__(self, limits: ForegroundLimit) -> None:
        self.limits = limits

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None or shell.parse_error:
            return RuleAnswer.allowed()
        run = self.limits.of(hook.environment_id, shell)
        return RuleAnswer.allowed().running(StartProcess.of(hook, shell, run)).rewriting_after_commands(lambda results: self.tool_input(hook, shell, run, results))

    def tool_input(self, hook: AgentHook, shell: ShellLine, run: ForegroundRun, results: Sequence[object]) -> Mapping[str, object]:
        process = next((result for result in results if isinstance(result, Process)), None)
        if process is None:
            return {}
        kept = {str(field): value for field, value in hook.event.tool_input().items() if field != BACKGROUND_FLAG}
        return {**kept, "command": RunnerLine.of(process.id, run, shell.line)}
