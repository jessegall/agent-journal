from dataclasses import dataclass, field, replace
from typing import ClassVar

from journal.events.event import Event
from journal.events.snapshot import Snapshot


@dataclass(frozen=True, kw_only=True)
class AgentEvent(Event):
    """Something the agent did, as its hook reported it or the journal saw it. One subclass per kind; features listen to these, never to raw hooks."""

    answers_hook: ClassVar[bool] = True
    carries_lines: ClassVar[bool] = True
    typed_after: ClassVar[float] = 0.0

    session: str = ""
    environment_id: int = 0
    provider: str = ""
    context: float | None = None
    time: float = 0.0
    snapshot: Snapshot = field(default_factory=lambda: Snapshot({}), compare=False)
    subagent: str = ""
    tool_use: int = 0

    @property
    def words(self) -> str:
        return ""

    def with_snapshot(self, snapshot: Snapshot) -> "AgentEvent":
        return replace(self, snapshot=snapshot)

    def recorded(self) -> dict:
        return {}

    def counted(self, tool_use: int) -> "AgentEvent":
        return replace(self, tool_use=tool_use)

    def placed(self, session: str, environment_id: int, provider: str, context: float | None, time: float, subagent: str = "") -> "AgentEvent":
        return replace(self, session=session, environment_id=environment_id, provider=provider, context=context, time=time, subagent=subagent)
