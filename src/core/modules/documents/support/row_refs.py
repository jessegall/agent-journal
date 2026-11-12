import re
from collections.abc import Sequence

from engine.model.model import Model
from engine.model.tables import Tables
from engine.query.queries import Queries
from engine.query.conditions.among import Among
from engine.errors.refusal import Refusal
from engine.registry.registry import Registry
from core.modules.documents.references.row_ref import RowRef
from core.modules.documents.support.resolved_row_ref import ResolvedRowRef

REF = re.compile(r"^([a-z_]+):(\d+)$")


class RowRefs:
    """Turns what a user writes for a row, its model or its table and a number (task:12 or tasks:12), into
    the row's model and number, through the models the installed modules declare."""

    def __init__(self, registry: Registry, tables: Tables, queries: Queries) -> None:
        self.registry, self.tables, self.queries = registry, tables, queries

    def model(self, name: str) -> type[Model] | None:
        for cli_name, entry in self.registry.models.items():
            model = entry.model.checked_class(Model)
            if name in (cli_name, model.model_name, self.tables.table(model).name):
                return model
        return None

    def parsed(self, text: str) -> RowRef:
        reference = self.resolved(text)
        return RowRef(reference.model.model_name, reference.row_id)

    def resolved(self, text: str) -> ResolvedRowRef:
        matched = REF.match(text)
        model = self.model(matched.group(1)) if matched else None
        if matched is None or model is None:
            raise Refusal(f"not a row: {text}; write each as plans:8 or tasks:12", "name each row by its table and number")
        return ResolvedRowRef(model, int(matched.group(2)))

    def existing(self, name: str, number: int) -> RowRef | None:
        model = self.model(name)
        return RowRef(model.model_name, number) if model is not None and self.queries.query(model).filter(id=number).exists() else None

    def existing_many(self, references: Sequence[tuple[str, int]]) -> tuple[RowRef, ...]:
        models = {name: self.model(name) for name, _ in references}
        model_ids: dict[type[Model], set[int]] = {}
        resolved: list[RowRef] = []
        for name, number in references:
            model = models[name]
            if model is None:
                continue
            resolved.append(RowRef(model.model_name, number))
            model_ids.setdefault(model, set()).add(number)
        existing: set[RowRef] = set()
        for model, numbers in model_ids.items():
            ids = tuple(numbers)
            for start in range(0, len(ids), 500):
                rows = self.queries.query(model).matching(Among("id", ids[start:start + 500])).all_rows()
                existing.update(RowRef(model.model_name, row.id) for row in rows)
        return tuple(dict.fromkeys(ref for ref in resolved if ref in existing))
