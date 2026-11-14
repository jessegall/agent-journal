from dataclasses import dataclass

from engine.model.assignable import Assignable


@dataclass(frozen=True)
class LinkedRows:
    """The parent row and the child row that one link row joins."""

    parent: Assignable
    child: Assignable
