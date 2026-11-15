from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from core.modules.processes.needs.silent_run_block_needs import SILENT_RUN_KEY, SilentRunBlockNeeds


class SilentRunBlockRule(DriverRule):
    """The old walk's answer for SilentRunBlockNeeds, which owns it: the walk refuses each tool while the run is
    silent, until the walk is deleted."""

    name = SILENT_RUN_KEY
    single_action_refusal = "A tool is refused while a silent run is held, naming the run and its exits; the hold keeps its own rule"
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, needs: SilentRunBlockNeeds) -> None:
        self.needs = needs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        tool = hook.event.tool
        run = self.needs.held(hook.agent_id) if tool is not None and not tool.block_exempt else None
        return RuleAnswer.refused(SilentRunBlockNeeds.nudge(run)) if run is not None else RuleAnswer.allowed()
