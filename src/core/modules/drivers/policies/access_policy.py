from engine.agent_machine.contracts.event_policy import EventPolicy
from engine.driver.hook_event import HookEvent
from engine.driver.agent_message import AgentMessage
from core.modules.drivers.support.read_only_access import ReadOnlyAccess


class AccessPolicy(EventPolicy):
    """An agent with read-only access reads, searches and runs the journal lines its type lists, on every
    program; the rest is refused with the read-only text, which names journal permission ask."""

    key = "drivers.access"
    rank = "access.all"

    def __init__(self, access: ReadOnlyAccess) -> None:
        self.access = access

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        return self.access.refusal(event, agent_id)
