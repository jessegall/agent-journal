from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass

SHORT_COMMIT = 7


@dataclass(frozen=True)
class GraphStatus:
    """Where a folder's graph stands against its commit: the commit the folder is at, the commit and moment of
    the last refresh, whether one runs and whether this call started it."""

    commit: str
    graph_commit: str
    refreshed_at: str
    is_running: bool
    is_started: bool

    @property
    def is_current(self) -> bool:
        return bool(self.graph_commit) and self.graph_commit == self.commit

    @property
    def line(self) -> str:
        stored_graph_text = f"graphify-out holds the graph of commit {self.graph_commit[:SHORT_COMMIT]}" if self.graph_commit else "graphify-out has no graph yet"
        if self.is_running:
            return f"Graphify is refreshing the graph for commit {self.commit[:SHORT_COMMIT]}: {stored_graph_text}."
        if self.is_current:
            return f"Graphify graph in graphify-out is current as of commit {self.commit[:SHORT_COMMIT]}."
        return f"Graphify graph is not current for commit {self.commit[:SHORT_COMMIT]}: {stored_graph_text}."

    def lines(self) -> Sequence[str]:
        return [self.line]

    def json(self) -> Mapping[str, object]:
        return {**asdict(self), "line": self.line, "is_current": self.is_current}
