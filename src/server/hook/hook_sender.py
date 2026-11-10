from collections.abc import Mapping
from dataclasses import dataclass

from engine.enums.agent_role import AgentRole
from core.base.driver.hook_event import HookEvent
from core.base.driver.hook_event_name import HookEventName
from engine.types.type_guards import is_mapping
from server.hook.queue_priority import QueuePriority
from server.server_context import AGENT_HOOK_LIMIT_SECONDS, HOOK_LIMIT_SECONDS


@dataclass(frozen=True)
class HookSender:
    """The sender and queue requirements read from a prepared or raw hook body."""

    role: str
    session: str
    event_name: str
    event: HookEventName | None
    priority: QueuePriority
    limit_seconds: float

    @classmethod
    def parsed(cls, data: object, main_limit_seconds: float = HOOK_LIMIT_SECONDS, agent_limit_seconds: float = AGENT_HOOK_LIMIT_SECONDS) -> "HookSender":
        fields: Mapping[object, object] = data if is_mapping(data) else {}
        role = str(fields.get("role") or AgentRole.MAIN)
        session = str(fields.get("session", fields.get("session_id", "")))
        event_name = str(fields.get("event", fields.get("hook_event_name", "hook")))
        normalized_name = event_name.replace("_", "").casefold()
        event = next((event for event in HookEventName if event.value.replace("_", "").casefold() == normalized_name), None)
        is_main = role == AgentRole.MAIN
        priority = QueuePriority.MAIN_AGENT_HOOK if is_main else QueuePriority.AGENT_HOOK
        return cls(role, session, event_name, event, priority, main_limit_seconds if is_main else agent_limit_seconds)

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
        return HookEvent.requires_check(self.event, self.role)
