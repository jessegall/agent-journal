from journal.engine.base_state import BaseState
from journal.engine.support.stack import Stack
from journal.models.agent import Agent
from journal.engine.states.wait import Wait
from journal.engine.states.compacting import Compacting
from journal.engine.states.ended import Ended
from journal.support.features_known import FeaturesKnown


class StatesCatalogue:
    """Every state by name: the engine's own and those of every feature. A row's state column becomes the class that holds its behaviour; a name no feature holds any more resolves to the first state, Idle."""

    OWN = (Compacting, Ended)

    def __init__(self, features: FeaturesKnown) -> None:
        self._states = {state.name: state for state in features.states()} | {state.name: state for state in self.OWN}

    def known(self, name: str) -> bool:
        return name in self._states

    def names(self) -> list[str]:
        return sorted(self._states)

    def waits(self) -> list[str]:
        return sorted(name for name, state in self._states.items() if issubclass(state, Wait))

    def title_of(self, name: str) -> str:
        return self._states[name].title if name in self._states else name

    def parent_of(self, name: str) -> str:
        state = self._states.get(name)
        return next((base.name for base in state.__mro__[1:] if base in self._states.values()), "") if state else ""

    def listed(self) -> list[dict]:
        names = ["idle"] + [name for name in self._states if name != "idle"]
        return [{"key": name, "title": self.title_of(name), "parent": self.parent_of(name)} for name in names]

    def named(self, name: str, data: dict) -> BaseState:
        state = self._states.get(name) or self._states["idle"]
        return state.from_data(data or {})

    def first(self) -> BaseState:
        return self.named("idle", {})

    def is_floor(self, state: BaseState) -> bool:
        return isinstance(state, type(self.first()))

    def stack_of(self, agent: Agent) -> Stack:
        if not agent.stack:
            return self.stack_under(self.named(agent.state, agent.data))
        return Stack(tuple(self.named(row["state"], row["data"]) for row in agent.stack))

    def stack_under(self, state: BaseState) -> Stack:
        layers = [state]
        if not self.is_floor(layers[-1]):
            layers.append(self.first())
        return Stack(tuple(reversed(layers)))
