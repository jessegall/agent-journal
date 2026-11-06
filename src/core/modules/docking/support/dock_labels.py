from core.base.missing_rows_error import MissingRowsError
from core.base.model.model import Model
from core.base.listener.event_rows import EventRows
from core.base.registry.registry import Registry

TITLE_FIELDS = ("title", "name", "text", "label")
TEXT_FIELDS = ("brief", "abstract", "text", "goal", "outcome", "detail")
TEXT_LIMIT_CHARACTERS = 200


class DockLabels:
    """The title and the line of text a docked item shows, read from its row when it is docked: the
    type's title with {row_id} and {row_title} filled, and the first of the row's brief, abstract, text,
    goal, outcome or detail. Both are empty when the type or the row is not found, and the guards refuse."""

    def __init__(self, registry: Registry, rows: EventRows) -> None:
        self.registry, self.rows = registry, rows

    def read(self, type_name: str, row_model: str, row_id: int) -> tuple[str, str]:
        entry = next((dock for dock in self.registry.docks if dock.type == type_name), None)
        model = self.registry.models.get(row_model)
        if entry is None or model is None:
            return "", ""
        try:
            row = self.rows.required(model.model.checked_class(Model), row_id)
        except MissingRowsError:
            return "", ""
        title = entry.title.replace("{row_id}", str(row_id)).replace("{row_title}", self.field(row, TITLE_FIELDS)).strip()
        return ("" if title.endswith(":") else title), self.field(row, TEXT_FIELDS)[:TEXT_LIMIT_CHARACTERS]

    def field(self, row: Model, names: tuple[str, ...]) -> str:
        return next((str(getattr(row, name)) for name in names if getattr(row, name, "")), "")
