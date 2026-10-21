from dataclasses import dataclass

from journal.engine.base_state import BaseState


@dataclass(frozen=True)
class Stack:
    """The agent's states, bottom to top, as the row keeps them; the bottom state is never popped."""

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
