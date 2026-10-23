from dataclasses import dataclass

from journal.engine.base_state import BaseState
from journal.engine.support.typist import Typist


@dataclass(frozen=True)
class Stack:
    """The agent's states, bottom to top, as the row keeps them; the bottom state is never popped. Replacing an earlier stack, each state leaving is told it exits and each one arriving that it enters, with the typist they may switch off or on."""

    states: tuple[BaseState, ...]

    def top(self) -> BaseState:
        return self.states[-1]

    def with_top(self, state: BaseState) -> "Stack":
        return Stack((*self.states[:-1], state))

    def pushed(self, state: BaseState) -> "Stack":
        return Stack((*self.states, state))

    def popped(self) -> "Stack":
        return self if len(self.states) == 1 else Stack(self.states[:-1])

    def serialized(self) -> list[dict]:
        return [{"state": state.name, "data": state.serialized()} for state in self.states]

    def replace(self, previous: "Stack", typist: Typist) -> None:
        staying, leaving = {type(state) for state in self.states}, {type(state) for state in previous.states}
        for state in previous.states:
            if type(state) not in staying:
                state.on_exit(typist)
        for state in self.states:
            if type(state) not in leaving:
                state.on_enter(typist)
