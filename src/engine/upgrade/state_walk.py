from collections import deque
from engine.model.added_state import StateValue
from engine.model.lifecycle import Lifecycle


class StateWalk:
    """The states a row passes from its first state to another by the moves of its lifecycle, which a row from
    version 4 takes one by one because the table's triggers allow no jump."""

    def __init__(self, lifecycle: type[Lifecycle]) -> None:
        self.lifecycle = lifecycle

    def path(self, target: StateValue) -> list[StateValue] | None:
        first = self.lifecycle.initial[0]
        queue: deque[list[StateValue]] = deque([[first]])
        visited: set[StateValue] = {first}
        while queue:
            route = queue.popleft()
            if route[-1] == target:
                return route[1:]
            next_states = [move.target for move in self.lifecycle.outgoing_moves(route[-1]) if move.target not in visited]
            visited.update(next_states)
            queue.extend([*route, state] for state in next_states)
        return None
