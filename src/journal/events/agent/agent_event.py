from dataclasses import dataclass, field, replace
from typing import ClassVar

from journal.events.event import Event
from journal.events.standing import Standing


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
    at: float = 0.0
    standing: Standing = field(default_factory=lambda: Standing({}), compare=False)
    subagent: str = ""

    @property
    def words(self) -> str:
        return ""

    def with_standing(self, standing: Standing) -> "AgentEvent":
        return replace(self, standing=standing)

    def placed(self, session: str, environment_id: int, provider: str, context: float | None, at: float, subagent: str = "") -> "AgentEvent":
        return replace(self, session=session, environment_id=environment_id, provider=provider, context=context, at=at, subagent=subagent)
