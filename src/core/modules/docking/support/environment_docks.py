from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.docking.models.dock import Dock


class EnvironmentDocks:
    """Shares the dock of each environment until it changes."""

    def __init__(self, queries: Queries, kept: KeptRows) -> None:
        self.queries, self.kept = queries, kept

    def find(self, environment_id: int) -> Dock | None:
        return self.kept.read("docks", self.queries.query(Dock).filter(environment_id=environment_id).first,
                              "environment_id = ?", [environment_id], name="docking.environment_dock")

    def remember(self, dock: Dock) -> None:
        self.kept.update("docks", lambda previous: dock, "environment_id = ?", [dock.environment_id], name="docking.environment_dock")
