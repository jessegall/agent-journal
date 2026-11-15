from engine.enums.rule_priority import RulePriority
from suites.coding.modules.workers.types.worker import Worker
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.policies.test_runs.worker_test_line_policy import WorkerTestLinePolicy


class WorkerTestLineRule(DriverRule):
    """The old walk's answer for WorkerTestLinePolicy, which owns it, until the walk is deleted."""

    name = WorkerTestLinePolicy.key
    priority = RulePriority.COMMAND_CATEGORY_CHECK
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [Worker.key]
    single_action_refusal = "A worker runs a test only through its named test commands"

    def __init__(self, policy: WorkerTestLinePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
