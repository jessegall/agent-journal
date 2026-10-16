from dataclasses import dataclass
from typing import Callable

from journal.models.chart import Chart


@dataclass(frozen=True)
class Drawing:
    """A shipped workflow as the journal draws it: its title and the drawing that gives a chart its nodes and lines."""

    title: str
    draw: Callable[[Chart], None]
    locked: bool = False
    """True for a drawing that is the journal's law: drawn as a locked workflow."""
