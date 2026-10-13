"""What the dev faults feature recognises: a to-do of a fault's title that was filed or closed."""

from dataclasses import dataclass

from events import Fact


@dataclass(frozen=True, kw_only=True)
class OverdueTodoFiled(Fact):
    """A to-do was filed under the title of a fault that was over its budget, so the writes held for want of one are let go."""

    title: str


@dataclass(frozen=True, kw_only=True)
class OverdueTodoClosed(Fact):
    """The to-do of a fault that was over its budget was closed, so the count of that fault starts again."""

    title: str
