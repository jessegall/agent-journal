from dataclasses import dataclass, replace

from journal.events.event import Event


@dataclass(frozen=True, kw_only=True)
class AgentEvent(Event):
    """Something the agent did, as its hook reported it. One subclass per hook kind; features listen to these, never to raw hooks."""

    session: str = ""
    environment_id: int = 0
    provider: str = ""
    context: float | None = None
    """How full the agent's context window is, 0 to 1, when its provider reports it."""

    def placed(self, session: str, environment_id: int, provider: str, context: float | None) -> "AgentEvent":
        return replace(self, session=session, environment_id=environment_id, provider=provider, context=context)
