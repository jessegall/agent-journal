from core.base.database.kept_rows import KeptRows
from engine.query.queries import Queries
from core.modules.docking.models.dock import Dock


class EnvironmentDocks:
    """Shares the dock of each environment until it changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find(self) -> Dock | None:
        return self.kept.scoped_read("docks", self.queries.query(Dock).first, name="docking.environment_dock")

    def remember(self, dock: Dock) -> None:
        self.kept.scoped_update("docks", lambda previous: dock, name="docking.environment_dock")
