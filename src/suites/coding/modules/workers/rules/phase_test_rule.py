from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.rule_priority import RulePriority
from suites.coding.modules.workers.support.phase_test_runs import PHASE_TESTS_KEY, PhaseTestRuns
from suites.coding.modules.workers.types.worker import Worker


class PhaseTestRule(DriverRule):
    """The old walk's answer for PhaseTestPolicy, PhaseTestLines and PhaseTestEffect, which own it, until the walk is
    deleted."""

    name = PHASE_TESTS_KEY
    priority = RulePriority.COMMAND_PHASE_CHECK
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [Worker.key]
    single_action_refusal = "Allows counted test runs between two commits and handles requests after the allowance is spent"

    def __init__(self, runs: PhaseTestRuns) -> None:
        self.runs = runs

    def answer(self, hook: AgentHook) -> RuleAnswer:
        answer = self.runs.answer(hook.event, hook.agent_id)
        if answer.refusal is not None:
            return RuleAnswer.refused(answer.refusal)
        return RuleAnswer.with_nudges(*answer.nudges).running_unrefused(*answer.records)
