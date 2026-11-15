from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from core.modules.sequences.needs.unstarted_step_needs import UNTAKEN_STEP_KEY, UnstartedStepNeeds
from core.modules.sequences.support.sequence_step_started import SequenceStepStarted


class UnstartedStepRule(DriverRule):
    """The old walk's answer for UnstartedStepNeeds, which owns it, until the walk is deleted."""

    name = UNTAKEN_STEP_KEY
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]

    def __init__(self, needs: UnstartedStepNeeds) -> None:
        self.needs = needs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        run = self.needs.untaken(hook.agent_id)
        if run is None:
            return RuleAnswer.allowed()
        return RuleAnswer.blocked(hook, UnstartedStepNeeds.nudge(run), SequenceStepStarted([run.id, run.step_number]))
