from collections.abc import Mapping, Sequence
from dataclasses import asdict, dataclass


@dataclass(frozen=True)
class ToolCard:
    """What the Tools page shows of one tool: whether it is installed and on, whether its refresh runs or failed
    for the project's commit, and when its graph was last refreshed."""

    name: str
    title: str
    description: str
    is_installed: bool
    is_on: bool
    is_running: bool
    is_failed: bool
    refreshed_at: str
    commit: str

    def lines(self) -> Sequence[str]:
        refreshed = f"last refresh {self.refreshed_at}" if self.refreshed_at else "never refreshed"
        return [f"{self.name}: {'on' if self.is_on else 'off'}, {'installed' if self.is_installed else 'not installed'}, {refreshed}"]

    def json(self) -> Mapping[str, object]:
        return asdict(self)
