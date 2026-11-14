from collections.abc import Mapping

from suites.coding.modules.workers.types.worker import Worker
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.agent_role import AgentRole
from engine.enums.hook_event_name import HookEventName
from engine.driver.rule_answer import RuleAnswer
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.support.context_limit_check import ContextLimitCheck

ERROR_FIELDS = ("error", "error_details", "last_assistant_message")
FULL_CONTEXT_TEXTS = ("prompt is too long", "context window", "context length")
# the error value Claude Code gives a prompt that is too long (report 1458); it also comes for a PDF too large, a bad
# credential and more, so it never decides alone: another value rules a full context out, and the words decide
CONTEXT_FULL_ERROR_VALUES = tuple(["invalid_request"])


class ContextFullErrorCompactionRule(DriverRule):
    """A turn the program ended with an error because the context is full asks for one compaction of that agent,
    whatever the context limit is set to; while a compaction of it is open, nothing more is asked."""

    name = "workers.context-full-stop"
    hook = HookEventName.STOP_FAILURE
    drivers = ["*"]
    roles = [AgentRole.MAIN, Worker.key]
    disabled_scopes = [ActorScope]

    def __init__(self, limit_check: ContextLimitCheck) -> None:
        self.limit_check = limit_check

    def answer(self, hook: AgentHook) -> RuleAnswer:
        if not self.is_full_context(hook.event.raw) or self.limit_check.is_compaction_requested(hook.agent_id, hook.timestamp):
            return RuleAnswer.allowed()
        return RuleAnswer.allowed().running(CompactAgentContext(hook.agent_id))

    @staticmethod
    def is_full_context(body: Mapping[str, object]) -> bool:
        error = body.get("error")
        if isinstance(error, str) and error not in CONTEXT_FULL_ERROR_VALUES:
            return False
        details = " ".join(value.lower() for value in (body.get(field) for field in ERROR_FIELDS) if isinstance(value, str))
        return any(text in details for text in FULL_CONTEXT_TEXTS)
