from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.driver.rule_answer import RuleAnswer
from engine.enums.hook_event_name import HookEventName
from engine.enums.agent_role import AgentRole
from suites.coding.modules.workers.policies.worker_file_policy import WorkerFilePolicy


class WorkerFileRule(DriverRule):
    """The old walk's answer for WorkerFilePolicy, which owns it, until the walk is deleted."""

    name = WorkerFilePolicy.key
    hook = HookEventName.PRE_TOOL_USE
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]
    single_action_refusal = "The main agent edits no file inside a worker's worktree"

    def __init__(self, policy: WorkerFilePolicy) -> None:
        self.policy = policy

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudge = self.policy.refusal(hook.event, hook.agent_id)
        return RuleAnswer.refused(nudge) if nudge is not None else RuleAnswer.allowed()
