from journal.engine.agent_state import AgentState
from journal.engine.states.ended import Ended
from journal.engine.states.subagent import Subagent
from journal.features.registry import Registry


class StatesCatalogue:
    """Every state by name: the engine's own and those of every feature. A row's state column becomes the class that holds its behaviour; a name no feature holds any more resolves to the first state, Idle."""

    OWN = (Ended, Subagent)

    def __init__(self, registry: Registry) -> None:
        self.registry = registry
        self._states = {state.name: state for feature in registry.features for state in feature.states} | {state.name: state for state in self.OWN}

    def known(self, name: str) -> bool:
        return name in self._states

    def names(self) -> list[str]:
        return sorted(self._states)

    def named(self, name: str, data: dict) -> AgentState:
        state = self._states.get(name) or self._states["idle"]
        return state.from_data(data or {})

    def first(self) -> AgentState:
        return self.named("idle", {})
