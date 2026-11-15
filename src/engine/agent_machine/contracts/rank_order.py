from dataclasses import dataclass


@dataclass(frozen=True)
class RankOrder:
    """The order of the rank keys a driver's table uses, highest first, per sort of contribution; rank keys
    are names a module gives."""

    policies: tuple[str, ...]
    blocks: tuple[str, ...]

    def place(self, rank: str) -> int:
        order = [*self.policies, *self.blocks]
        return order.index(rank) if rank in order else len(order)
