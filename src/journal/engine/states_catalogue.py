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
        """The wait a row event is about: the state itself when it waits on something outside; None when the agent waits on nothing."""
        return state if isinstance(state, Paused) else None

    def waits(self) -> list[str]:
        """The states that wait for something outside and are left only by a release: a workflow for one of them must hold one."""
        return sorted(name for name, state in self._states.items() if issubclass(state, Paused) and not state.leaves_by_itself)

    def title_of(self, name: str) -> str:
        return self._states[name].title if name in self._states else name

    def parent_of(self, name: str) -> str:
        """The state this one inherits its conduct from, when it has one: the nearest base class that is a state of its own."""
        state = self._states.get(name)
        return next((base.name for base in state.__mro__[1:] if base in self._states.values()), "") if state else ""

    def listed(self) -> list[dict]:
        """Every state with its words and its parent, the first state first, then the rest as the features bring them."""
        names = ["idle"] + [name for name in self._states if name != "idle"]
        return [{"key": name, "title": self.title_of(name), "parent": self.parent_of(name)} for name in names]

    def named(self, name: str, data: dict) -> AgentState:
        state = self._states.get(name) or self._states["idle"]
        return state.from_data(data or {})

    def resumed(self, paused: Paused) -> AgentState:
        """The state a pause goes back to."""
        return self.named(paused.resume.get("state", "idle"), paused.resume.get("data", {}))

    def first(self) -> AgentState:
        return self.named("idle", {})
