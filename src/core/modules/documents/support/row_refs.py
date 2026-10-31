import re

from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.registry.registry import Registry
from core.modules.documents.support.row_ref import RowRef

REF = re.compile(r"^([a-z_]+):(\d+)$")


class RowRefs:
    """Turns what a person writes for a row, its model or its table and a number (task:12 or tasks:12), into the
    row's model and number, through the models the installed modules declare."""

    def __init__(self, registry: Registry, tables: Tables, queries: Queries) -> None:
        self.registry, self.tables, self.queries = registry, tables, queries

    def model(self, name: str) -> type[Model] | None:
        for cli_name, entry in self.registry.models.items():
            model = entry.model.checked_class(Model)
            if name in (cli_name, model.model_name, self.tables.table(model).name):
                return model
        return None

    def parsed(self, text: str) -> RowRef:
        matched = REF.match(text)
        model = self.model(matched.group(1)) if matched else None
        if matched is None or model is None:
            raise Refusal(f"not a row: {text}; write each as plans:8 or tasks:12", "name each row by its table and number")
        return RowRef(model.model_name, int(matched.group(2)))

    def existing(self, name: str, number: int) -> RowRef | None:
        model = self.model(name)
        return RowRef(model.model_name, number) if model is not None and self.queries.query(model).filter(id=number).exists() else None
