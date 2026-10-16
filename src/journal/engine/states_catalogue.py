from journal.engine.agent_state import AgentState
from journal.engine.states.paused import Paused
from journal.engine.states.ended import Ended
from journal.features.registry import Registry


class StatesCatalogue:
    """Every state by name: the engine's own and those of every feature. A row's state column becomes the class that holds its behaviour; a name no feature holds any more resolves to the first state, Idle."""

    OWN = (Ended,)

    def __init__(self, registry: Registry) -> None:
        self.registry = registry
        self._states = {state.name: state for feature in registry.features for state in feature.states} | {state.name: state for state in self.OWN}

    def known(self, name: str) -> bool:
        return name in self._states

    def names(self) -> list[str]:
        return sorted(self._states)

    def wait_in(self, state: AgentState) -> AgentState | None:
        """The wait a row event is about: the state itself when it waits on something outside, else the first such wait beneath the pauses the agent owes the journal, rebuilt from the resume chain; None when the agent waits on nothing."""
        while isinstance(state, Paused):
            if not state.owed_by_agent:
                return state
            state = self.named(state.resume.get("state", "idle"), state.resume.get("data", {}))
        return None

    def waits(self) -> list[str]:
        """The states that wait for something outside and are left only by a release: a workflow for one of them must hold one."""
        return sorted(name for name, state in self._states.items() if issubclass(state, Paused) and not state.owed_by_agent)

    def named(self, name: str, data: dict) -> AgentState:
        state = self._states.get(name) or self._states["idle"]
        return state.from_data(data or {})

    def first(self) -> AgentState:
        return self.named("idle", {})
