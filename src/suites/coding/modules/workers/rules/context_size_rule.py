from core.base.driver.agent_hook import AgentHook
from core.base.driver.driver_rule import DriverRule
from core.base.driver.hook_event_name import HookEventName
from core.base.driver.rule_answer import RuleAnswer
from core.base.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_COMPACTED
from suites.coding.support.coding_helper_role import CodingHelperRole
from core.base.agent_role import AgentRole
from suites.coding.support.context_limit_check import ContextLimitCheck


class ContextSizeRule(DriverRule):
    """A stop compacts an agent at once when its context has reached the token limit, unless it holds a task it is to
    finish first and has not reached the second limit."""

    name = "workers.context-limit"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, limit_check: ContextLimitCheck) -> None:
        self.limit_check = limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.limit_check.needs_compaction(hook.agent_id) or self.limit_check.was_asked(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_COMPACTED.nudge()).running(CompactAgentContext(hook.agent_id))
