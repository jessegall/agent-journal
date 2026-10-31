from core.base.change.logged_event import LoggedEvent
from core.base.container import Container
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.shared_rows import SharedRows
from core.base.registry.registry import Registry
from server.viewer.shared_row import SharedRow


class ShareEvents:
    """Which events a share session may follow: those of the shared row and of the rows it includes, tabled_ids by
    their table and id, so no other row's change reaches a link."""

    def __init__(self, container: Container, shared: SharedRow) -> None:
        self.container, self.shared = container, shared

    def rows(self) -> dict[str, set[int]]:
        registry = self.container.get(Registry)
        tables = self.container.get(Tables)
        tabled_ids = {self.table_name(registry, tables, self.shared.model): {self.shared.id}}
        if self.shared.model in registry.shared_rows:
            included = self.container.get(registry.shared_rows[self.shared.model].checked_class(SharedRows))
            for group in included.rows(self.shared.id):
                tabled_ids.setdefault(self.table_name(registry, tables, group.model), set()).update(group.ids)
        return tabled_ids

    def admitted(self, events: list[LoggedEvent]) -> list[LoggedEvent]:
        rows = self.rows()
        return [event for event in events if event.row_id in rows.get(event.row_table, set())]

    @staticmethod
    def table_name(registry: Registry, tables: Tables, model: str) -> str:
        row_model: type[Model] = registry.models[model].model.checked_class(Model)
        return tables.table(row_model).name
