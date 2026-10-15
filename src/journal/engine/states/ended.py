from dataclasses import dataclass

from journal.engine.agent_state import AgentState
from journal.engine.resume import Resume
from journal.engine.transition import Transition
from journal.events.agent.session_started import SessionStarted


@dataclass(frozen=True)
class Ended(AgentState):
    """The session is over. Nothing is allowed and nothing is said, until the same session starts again: then it is idle."""

    name = "ended"

    def session_started(self, event: SessionStarted) -> Transition:
        return self.go(Resume(state="idle", data={}))
