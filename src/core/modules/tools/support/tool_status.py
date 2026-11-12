from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class ToolStatus:
    """Where a tool's output in a folder stands against the folder's commit: the commit the folder is at, the commit
    and moment of the last refresh, whether one runs and whether this call started it, the line the tool words it
    in, and the file a started refresh writes, which the journal records as changed."""

    commit: str
    graph_commit: str
    refreshed_at: str
    is_running: bool
    is_started: bool
    line: str
    changed_path: str = ""

    @property
    def is_current(self) -> bool:
        return bool(self.graph_commit) and self.graph_commit == self.commit

    def lines(self) -> Sequence[str]:
        return [self.line]

    def json(self) -> Mapping[str, object]:
        values = asdict(self)
        values.pop("changed_path")
        return {**values, "is_current": self.is_current}
