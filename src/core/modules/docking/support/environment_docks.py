from engine.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.docking.models.dock import Dock


class EnvironmentDocks:
    """Shares the dock of each environment until it changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find(self) -> Dock | None:
        docks = self.queries.query(Dock)
        return self.kept.read(docks, docks.first, name="docking.environment_dock")

    def remember(self, dock: Dock) -> None:
        self.kept.update(self.queries.query(Dock), lambda previous: dock, name="docking.environment_dock")
