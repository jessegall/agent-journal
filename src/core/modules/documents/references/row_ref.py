from dataclasses import dataclass


@dataclass(frozen=True)
class RowRef:
    """A row named by its model and its number."""

    model: str
    row_id: int

    @property
    def text(self) -> str:
        return f"{self.model}:{self.row_id}"
