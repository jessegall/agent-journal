from dataclasses import dataclass

from journal.models.model import Model
from journal.models.node_kind import NodeKind


@dataclass(frozen=True)
class Node(Model):
    """One box of the chart: a trigger, a check or an action, naming an entry of the catalogue, with the text the entry takes and its place on the canvas."""

    kind: NodeKind = NodeKind.TRIGGER
    key: str = ""
    text: str = ""
    x: int = 0
    y: int = 0
