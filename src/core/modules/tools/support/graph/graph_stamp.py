from dataclasses import dataclass


@dataclass(frozen=True)
class GraphStamp:
    """The commit a graph was last refreshed for and when the refresh ended."""

    commit: str
    refreshed_at: str

    @classmethod
    def read(cls, text: str) -> "GraphStamp | None":
        parts = text.split()
        return cls(parts[0], parts[1]) if len(parts) == 2 else None
