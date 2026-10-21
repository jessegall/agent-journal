from journal.models.dashboard_row import DashboardRow
from journal.repositories.repository import Repository


class DashboardRows(Repository[DashboardRow]):
    """The lines plugins keep on their dashboards, the same for every environment."""

    model = DashboardRow

    def plugin_rows(self, plugin: str) -> list[DashboardRow]:
        return self.matching(plugin=plugin)

    def keyed(self, plugin: str, key: str) -> DashboardRow | None:
        rows = self.matching(plugin=plugin, key=key)
        return rows[0] if rows else None
