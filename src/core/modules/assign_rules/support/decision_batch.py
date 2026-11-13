from collections.abc import Callable
from dataclasses import dataclass, field

NEVER_GIVEN = -1


@dataclass
class DecisionBatch:
    """The decisions of one step: what each agent held when the step began, read once, and the tasks it was given
    in the step in their order, so a later decision of the same step counts them before the assignments are written."""

    held_at_start: dict[int, int] = field(default_factory=dict)
    last_given_at_start: dict[int, str] = field(default_factory=dict)
    turns: dict[int, list[int]] = field(default_factory=dict)
    given_count: int = 0

    def held(self, actor_id: int, read_held: Callable[[], int]) -> int:
        if actor_id not in self.held_at_start:
            self.held_at_start[actor_id] = read_held()
        return self.held_at_start[actor_id] + len(self.turns.get(actor_id, []))

    def last_turn(self, actor_id: int) -> int:
        return self.turns.get(actor_id, [NEVER_GIVEN])[-1]

    def last_given_at(self, actor_id: int, read_last_given_at: Callable[[], str]) -> str:
        if actor_id not in self.last_given_at_start:
            self.last_given_at_start[actor_id] = read_last_given_at()
        return self.last_given_at_start[actor_id]

    def give(self, actor_id: int) -> None:
        self.turns.setdefault(actor_id, []).append(self.given_count)
        self.given_count += 1
