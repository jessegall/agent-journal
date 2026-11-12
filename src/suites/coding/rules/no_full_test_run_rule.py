from typing import ClassVar

from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.driver.rule_answer import RuleAnswer
from suites.coding.support.coding_nudges import FULL_TEST_RESTRICTION


class NoFullTestRunRule(DriverRule):
    """Refuses a shell line containing a full test run, while allowing named tests."""

    name = "drivers.no-full-test-run"
    hook = HookEventName.PRE_TOOL_USE
    exempt = True
    refusal: ClassVar[NudgeDeclaration] = FULL_TEST_RESTRICTION
    single_action_refusal = "Refuses a shell line containing a full test run, while allowing named tests"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is not None and shell.has_full_test_run:
            return RuleAnswer.refused(self.refusal.nudge())
        return RuleAnswer.allowed()
