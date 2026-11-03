from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from suites.coding.support.coding_nudges import WORKER_FULL_TEST_RUN


class WorkerFullTestRunRule(DriverRule):
    """A worker runs only the tests of what it changed: a tool call with a run of the whole suite in its chain is
    refused whole."""

    name = "workers.no-full-test-run"
    hook = HookEventName.PRE_TOOL_USE

    def answer(self, hook: AgentHook) -> RuleAnswer:
        shell = hook.event.tool.shell if hook.event.tool is not None else None
        if shell is not None and shell.has_full_test_run:
            return RuleAnswer.refused(WORKER_FULL_TEST_RUN.nudge())
        return RuleAnswer.allowed()
