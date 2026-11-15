from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.policies.worker_reuse_policy import WorkerReusePolicy


class WorkerReuseRule(DriverRule):
    """The old walk's answer for WorkerReusePolicy, which owns it, until the walk is deleted."""

    name = WorkerReusePolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["*"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "A dispatch for work that an ended worker still holds in its worktree is refused"

    def __init__(self, policy: WorkerReusePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
