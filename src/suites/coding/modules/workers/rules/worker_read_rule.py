from suites.coding.modules.workers.types.worker import Worker
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from suites.coding.modules.workers.policies.worker_read_policy import WorkerReadPolicy


class WorkerReadRule(DriverRule):
    """The old walk's answer for WorkerReadPolicy, which owns it, until the walk is deleted."""

    name = WorkerReadPolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [Worker.key]
    single_action_refusal = "A worker reads only its own worktree, the temporary folder and its program's home"

    def __init__(self, policy: WorkerReadPolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
