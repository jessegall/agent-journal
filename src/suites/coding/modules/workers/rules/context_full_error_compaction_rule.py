from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.support.context_limit_check import ContextLimitCheck

ERROR_FIELDS = ("error", "error_details")
FULL_CONTEXT_TEXTS = ("prompt is too long", "context window", "context length")


class ContextFullErrorCompactionRule(DriverRule):
    """A turn the program ended with an error because the context is full asks for one compaction of that agent,
    whatever the context limit is set to; while a compaction of it is open, nothing more is asked."""

    name = "workers.context-full-stop"
    hook = HookEventName.STOP_FAILURE
    drivers = ["*"]
    roles = [AgentRole.MAIN, CodingHelperRole.WORKER]
    disabled_scopes = [ActorScope]

    def __init__(self, limit_check: ContextLimitCheck) -> None:
        self.limit_check = limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        details = " ".join(value.lower() for value in (hook.event.raw.get(field) for field in ERROR_FIELDS) if isinstance(value, str))
        if not any(text in details for text in FULL_CONTEXT_TEXTS) or self.limit_check.is_compaction_requested(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(CompactAgentContext(hook.agent_id))
