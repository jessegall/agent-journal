from dataclasses import dataclass


@dataclass(frozen=True)
class WaitNode:
    """A task or a plan in the waits that hold work back."""

    node_type: str
    row_id: int

    @property
    def text(self) -> str:
        return f"{self.node_type} {self.row_id}"
