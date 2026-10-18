from dataclasses import dataclass

from journal.models.node import Node
from journal.models.node_kind import NodeKind


@dataclass(frozen=True)
class DrawnNode:
    """A node as a drawing gives it, before it is saved: its id is a saved node's number or a name the canvas made up."""

    id: str
    kind: str
    key: str
    text: str = ""
    x: int = 0
    y: int = 0

    @classmethod
    def from_payload(cls, payload: dict) -> "DrawnNode":
        return cls(str(payload["id"]), payload["kind"], payload["key"], payload.get("text", ""), int(payload.get("x", 0)), int(payload.get("y", 0)))

    @classmethod
    def of(cls, node: Node) -> "DrawnNode":
        return cls(str(node.id), node.kind, node.key, node.text, node.x, node.y)

    @property
    def number(self) -> int:
        """The saved node's number; 0 for a node the canvas made up."""
        return int(self.id) if self.id.isdigit() else 0

    def is_kind(self, kind: NodeKind) -> bool:
        return self.kind == kind
