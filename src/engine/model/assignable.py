from typing import ClassVar

from engine.enums.actor_count import ActorCount
from engine.model.children import Children


class Assignable:
    """A model whose rows can be given to actors. The assignments are rows of the assignments table, never a
    column of the model. A model says how many actors one row takes, which rows it also assigns when a row of
    it is assigned, and which of its rows the assignment of a parent passes over."""

    takes_actors: ClassVar[ActorCount]
    assigns: ClassVar[tuple[Children, ...]] = ()

    def cascade_skips(self, actor_id: int) -> bool:
        return False
