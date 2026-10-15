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
    shipped: bool = False
    """True for a node the journal shipped and the user has not touched; an edit makes it the user's, so a later release knows which rules are still its own."""

    def cleaned(self) -> "Node":
        """The text as it may reach a prompt or a terminal: printable characters and spaces only, one line."""
        return self.with_(text="".join(ch for ch in self.text if ch.isprintable()).strip())
