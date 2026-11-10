from collections.abc import Sequence
from dataclasses import dataclass


@dataclass(frozen=True)
class InspectorLinks:
    """The folding links section of an inspector: the kinds of linked rows that get a tab (none named: every
    kind the row has), whether it starts open, whether it leaves out the rows of the row's own plan and how
    many rows load per page."""

    categories: Sequence[str] = ()
    open: bool = False
    excludes_plan: bool = False
    page_size: int = 10
