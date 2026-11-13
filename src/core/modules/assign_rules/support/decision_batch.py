from dataclasses import dataclass, field


@dataclass
class DecisionBatch:
    """The decisions of one step: how many tasks each agent was given in it, so a later decision of the same step
    counts them before the assignments are written."""

    given: dict[int, int] = field(default_factory=dict)

    def count(self, actor_id: int) -> int:
        return self.given.get(actor_id, 0)

    def give(self, actor_id: int) -> None:
        self.given[actor_id] = self.count(actor_id) + 1
