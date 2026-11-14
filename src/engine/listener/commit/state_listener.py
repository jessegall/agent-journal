from typing import ClassVar

from engine.driver.agent_state import AgentState
from engine.event.event_subscriber import E
from engine.listener.commit.commit_listener import CommitListener


class StateListener(CommitListener[E]):
    """A commit listener that hears an event about an agent only while that agent is in its state; an event about
    no agent it hears always."""

    state: ClassVar[type[AgentState]]

    # the agent the event is about, or None for an event about no agent, which the listener then hears ungated
    def agent_of(self, event: E) -> int | None:
        raise NotImplementedError(f"{type(self).__name__} names no agent of its events")
