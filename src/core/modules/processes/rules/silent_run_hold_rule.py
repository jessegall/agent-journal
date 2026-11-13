from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.processes.support.held_runs import HeldRuns
from core.modules.processes.models.enums.pressure_level import PressureLevel
from core.modules.processes.support.process_nudges import SILENT_RUN_BLOCKED
from core.modules.processes.support.reading_notices.exit_texts import ExitTexts


class SilentRunHoldRule(DriverRule):
    """Holds the tool uses of an agent whose run has printed nothing for the hang time, naming the run
    and what its processor time does, until the agent reads its output or stops it, or a user
    releases it; the exits are said in the shared wording. Like every block it lets reads and
    journal commands through."""

    name = "processes.silent-run-hold"
    single_action_refusal = "A tool is refused while a silent run is held, naming the run and its exits; the hold keeps its own rule"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, blocked_runs: HeldRuns) -> None:
        self.held_runs = blocked_runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        if tool is None or tool.block_exempt:
            return RuleAnswer.allowed()
        silent_run = self.held_runs.found(hook.agent_id, hook.timestamp)
        if silent_run is None:
            return RuleAnswer.allowed()
        return RuleAnswer.refused(SILENT_RUN_BLOCKED.nudge(output=silent_run.process.id, seconds=silent_run.seconds, processor=silent_run.processor,
                                                    hint=ExitTexts.sentences(PressureLevel.HOLD.exits)))
