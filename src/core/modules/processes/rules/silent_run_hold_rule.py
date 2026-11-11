from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.held_run import HeldRun
from core.modules.processes.support.held_runs import HeldRuns
from core.modules.processes.support.process_nudges import SILENT_RUN_HELD

ANSWERING_COMMANDS = ("output read", "output stop")


class SilentRunHoldRule(DriverRule):
    """Holds every tool use of an agent whose run has printed nothing for the hang time, naming the run and what
    its processor time does, until the agent reads its output or stops it."""

    name = "processes.silent-run-hold"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, held_runs: HeldRuns) -> None:
        self.held_runs = held_runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        silent_run = self.held_runs.found(hook.agent_id, hook.timestamp)
        if silent_run is None or self.answers(hook, silent_run):
            return RuleAnswer.allowed()
        return RuleAnswer.refused(SILENT_RUN_HELD.nudge(output=silent_run.process.id, seconds=silent_run.seconds, processor=silent_run.processor))

    @staticmethod
    def answers(hook: AgentHook, silent_run: HeldRun) -> bool:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is None:
            return False
        return any(str(silent_run.process.id) in part.arguments for command in ANSWERING_COMMANDS for part in shell.parts_running_journal_command(command))
