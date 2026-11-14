from collections.abc import Mapping
from dataclasses import dataclass

Row = Mapping[str, object]


@dataclass(frozen=True)
class ResolvedConflict:
    """The row a clash keeps and the rows it removes, with the name of the rule that chose."""

    kept: Row
    removed: tuple[Row, ...]
    rule: str
