from collections.abc import Mapping, Sequence

from engine.agent.enums.role_group import RoleGroup
from engine.agent_machine.contracts.event_effect import EventEffect
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.time.clock import Clock
from core.modules.drivers.support.safeguards_stop import ERROR_FIELDS
from suites.coding.modules.workers.commands.compact_agent_context.compact_agent_context import CompactAgentContext
from suites.coding.support.context_limit_check import ContextLimitCheck

FULL_CONTEXT_TEXTS = ("prompt is too long", "context window", "context length")
CONTEXT_FULL_ERROR_VALUES = ("invalid_request",)


class FullContextCompactionEffect(EventEffect):
    """A turn the program ended with an error because the context is full asks for one compaction of that agent,
    whatever the context limit is set to; while a compaction of it is open, nothing more is asked. Claude Code
    gives a prompt that is too long the error value invalid_request (report 1458), which also comes for a PDF too
    large or a bad credential, so another error value rules a full context out and the words of the error
    decide."""

    key = "workers.context-full-stop"
    events = [HookEventName.STOP_FAILURE]
    role_group = RoleGroup.TASK

    def __init__(self, limit_check: ContextLimitCheck, clock: Clock) -> None:
        self.limit_check, self.clock = limit_check, clock

    def commands_of(self, event: HookEvent | None, agent_id: int) -> Sequence[Command[object]]:
        if event is None or not self.is_full_context(event.raw) or self.limit_check.is_compaction_requested(agent_id, self.clock.timestamp()):
            return []
        return [CompactAgentContext(agent_id)]

    @staticmethod
    def is_full_context(body: Mapping[str, object]) -> bool:
        error = body.get("error")
        if isinstance(error, str) and error not in CONTEXT_FULL_ERROR_VALUES:
            return False
        details = " ".join(value.lower() for value in (body.get(field) for field in ERROR_FIELDS) if isinstance(value, str))
        return any(text in details for text in FULL_CONTEXT_TEXTS)
