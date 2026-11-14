from collections.abc import Callable, Mapping
from dataclasses import dataclass

from engine.enums.agent_role import AgentRole
from engine.driver.hook_event import HookEvent
from engine.enums.hook_event_name import HookEventName
from engine.types.type_guards import is_mapping
from engine.enums.execution_priority import ExecutionPriority
from server.hook.hook_limits import AGENT_HOOK_LIMIT_SECONDS, HOOK_LIMIT_SECONDS, STOP_LIMIT_SECONDS

# the main agent's hooks go first and never wait out a limit; the hooks of other agents come next
MAIN_AGENT_HOOK_PRIORITY = ExecutionPriority.IMMEDIATE
AGENT_HOOK_PRIORITY = ExecutionPriority.RESERVED


@dataclass(frozen=True)
class HookSender:
    """The sender and queue requirements read from a prepared or raw hook body. A stop waits longer for the
    journal than other hooks, since holding a stop for a busy journal keeps the agent going in a loop."""

    role: str
    session: str
    event_name: str
    event: HookEventName | None
    priority: ExecutionPriority
    limit_seconds: float

    # the role comes from the server's own record of the session, never from the body, so a worker can not pass
    # itself off as the main agent
    @classmethod
    def parsed(cls, data: object, main_limit_seconds: float = HOOK_LIMIT_SECONDS, agent_limit_seconds: float = AGENT_HOOK_LIMIT_SECONDS,
               stop_limit_seconds: float = STOP_LIMIT_SECONDS, *, role_of: Callable[[str], str]) -> "HookSender":
        fields: Mapping[object, object] = data if is_mapping(data) else {}
        session = str(fields.get("session", fields.get("session_id", "")))
        role = role_of(session)
        event_name = str(fields.get("event", fields.get("hook_event_name", "hook")))
        normalized_name = event_name.replace("_", "").casefold()
        event = next((event for event in HookEventName if event.value.replace("_", "").casefold() == normalized_name), None)
        is_main = role == AgentRole.MAIN
        priority = MAIN_AGENT_HOOK_PRIORITY if is_main else AGENT_HOOK_PRIORITY
        limit_seconds = main_limit_seconds if is_main else agent_limit_seconds
        if event is HookEventName.STOP:
            limit_seconds = max(limit_seconds, stop_limit_seconds)
        return cls(role, session, event_name, event, priority, limit_seconds)

    @property
    def owner(self) -> str:
        return self.session

    @property
    def name(self) -> str:
        return {"helper": "Helper", "worker": "Worker"}.get(self.role, "Main agent")

    @property
    def is_stop(self) -> bool:
        return self.event is HookEventName.STOP

    @property
    def needs_check(self) -> bool:
        return HookEvent.is_checked_role(self.role)
