from dataclasses import dataclass
from typing import Callable

from journal.models.chart import Chart


@dataclass(frozen=True)
class Drawing:
    """A shipped workflow as the journal draws it: its title, the drawing that gives a chart its nodes and lines, and the listeners in code it carries the conduct of, switched off when it is made."""

    title: str
    draw: Callable[[Chart], None]
    replaces: tuple[str, ...] = ()
