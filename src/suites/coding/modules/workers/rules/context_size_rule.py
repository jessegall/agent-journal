from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.hook_history import HookHistory
from core.base.driver.rule_answer import RuleAnswer
from core.base.driver.seconds import Seconds
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.commands.choose_agent_control.choose_agent_control import ChooseAgentControl
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_COMPACTED
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.agent_role import AgentRole
from suites.coding.support.context_limit_check import ContextLimitCheck

RETRY_SECONDS = Seconds(600)


class ContextSizeRule(DriverRule):
    """A stop compacts an agent at once when its context has reached the token limit, unless it holds a task it is to
    finish first and has not reached the second limit."""

    name = "workers.context-limit"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, history: HookHistory, limit_check: ContextLimitCheck) -> None:
        self.history, self.limit_check = history, limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.limit_check.needs_compaction(hook.agent_id) or self.history.has_recent_answer(self.name, hook, RETRY_SECONDS):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_COMPACTED.nudge()).running(ChooseAgentControl(hook.agent_id, "context", self.limit_check.action()))
