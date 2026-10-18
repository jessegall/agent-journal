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
    subagent: str = ""
    """The subagent that did this, by its id, when the hook came from one rather than from the agent itself; a subagent's doing is not the agent working."""

    @property
    def words(self) -> str:
        """What the agent wrote in this event that the journal reads for its words: nothing, unless the event says otherwise."""
        return ""

    def placed(self, session: str, environment_id: int, provider: str, context: float | None, subagent: str = "") -> "AgentEvent":
        return replace(self, session=session, environment_id=environment_id, provider=provider, context=context, subagent=subagent)
