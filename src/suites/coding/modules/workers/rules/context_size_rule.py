from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.modules.workers.support.worker_nudges import CONTEXT_COMPACTED
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from engine.enums.agent_role import AgentRole
from suites.coding.support.context_limit_check import ContextLimitCheck


class ContextSizeRule(DriverRule):
    """A stop types the compaction of an agent whose program does not compact by its own window, when its context has
    reached the token limit, unless it holds a task it is to finish first and has not reached the second limit."""

    name = "workers.context-limit"
    hook = HookEventName.STOP
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, limit_check: ContextLimitCheck) -> None:
        self.limit_check = limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if self.limit_check.compacts_by_window(hook.agent_id) or not self.limit_check.needs_compaction(hook.agent_id) or self.limit_check.is_compaction_requested(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        return RuleAnswer.with_nudges(CONTEXT_COMPACTED.nudge()).running(CompactAgentContext(hook.agent_id))
