from collections.abc import Mapping, Sequence

from engine.agent.agent_checkouts import AgentCheckouts
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.driver.shell_line import ShellLine
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.commands.start_process.start_process import StartProcess
from core.modules.processes.effects.runner_start_effect import BACKGROUND_FLAG
from core.modules.processes.lines.runner_missing_lines import RunnerMissingLines
from core.modules.processes.models.process import Process
from core.modules.processes.support.foreground_run import ForegroundRun
from core.modules.processes.support.run_count_lines import RunCountLines
from core.modules.processes.support.runner_binary import RunnerBinary
from core.modules.processes.support.runner_line import RunnerLine
from core.modules.processes.support.runner_plan import RUNNER_REWRITE_KEY, RunnerPlan


class RunnerRewriteRule(DriverRule):
    """The old walk's answer for RunnerSandboxPolicy, RunnerMissingLines and RunnerStartEffect, which own it: the walk
    starts the run and rewrites the line after its command made the process, until the walk is deleted."""

    name = RUNNER_REWRITE_KEY
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    history = True
    overlay_proof = True
    single_action_refusal = "A shell line of any agent runs through the journal's runner"

    def __init__(self, plan: RunnerPlan, lines: RunnerMissingLines, runner: RunnerBinary, count_lines: RunCountLines, checkouts: AgentCheckouts) -> None:
        self.plan, self.lines, self.runner, self.count_lines, self.checkouts = plan, lines, runner, count_lines, checkouts

    def answer(self, hook: AgentHook) -> RuleAnswer:
        decision = self.plan.of_event(hook.event, hook.agent_id)
        if decision.refusal is not None:
            return RuleAnswer.refused(decision.refusal)
        if decision.runner_missing:
            return RuleAnswer.with_nudges(*self.lines.nudges(hook.event, hook.agent_id))
        if decision.run is None or decision.shell is None:
            return RuleAnswer.allowed()
        shell, run = decision.shell, decision.run
        return RuleAnswer.allowed().running(StartProcess.build(hook.agent_id, hook.event, shell, run)).rewriting_after_commands(lambda results: self.tool_input(hook, shell, run, results))

    def tool_input(self, hook: AgentHook, shell: ShellLine, run: ForegroundRun, results: Sequence[object]) -> Mapping[str, object]:
        process = next((made for made in results if isinstance(made, Process)), None)
        if process is None:
            return {}
        run = self.count_lines.counted(run, process)
        kept = {str(field): value for field, value in hook.event.tool_input().items() if field != BACKGROUND_FLAG}
        return {**kept, "command": RunnerLine.build(self.runner.path, process.id, process.claim_token, run, shell.runner_text, hook.event.session, self.checkouts.checkout(hook.agent_id))}
