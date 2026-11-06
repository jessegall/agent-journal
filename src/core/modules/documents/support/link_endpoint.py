from dataclasses import dataclass

from core.base.model.model import Model
from core.base.query.conditions.among import Among
from core.base.query.queries import Queries
from core.modules.documents.conditions.link_endpoint_columns import LinkEndpointColumns
from core.modules.documents.support.row_ref import RowRef
from core.modules.documents.support.row_refs import RowRefs
from core.modules.plans.models.phase import Phase
from core.modules.tasks.models.task_log import TaskLog


@dataclass(frozen=True)
class LinkEndpoint:
    """An endpoint's identity, title, availability and registered navigation reference."""

    model: str
    id: int
    title: str
    exists: bool
    unavailable: bool
    open_ref: str | None


class LinkEndpointReader:
    """Resolves endpoint titles and parent navigation in batches through registered models."""

    def __init__(self, queries: Queries, references: RowRefs) -> None:
        self.queries, self.references = queries, references

    def read(self, references: set[RowRef]) -> dict[RowRef, LinkEndpoint]:
        rows = self.rows(references)
        parents = {RowRef("task", row.task_id) for row in rows.values() if isinstance(row, TaskLog)}
        parents.update(RowRef("plan", row.plan_id) for row in rows.values() if isinstance(row, Phase))
        rows.update(self.rows(parents - rows.keys()))
        return {reference: self.endpoint(reference, rows) for reference in references}

    def rows(self, references: set[RowRef]) -> dict[RowRef, Model]:
        rows: dict[RowRef, Model] = {}
        for name in sorted({reference.model for reference in references}):
            model = self.references.model(name)
            if model is None:
                continue
            ids = tuple(reference.row_id for reference in references if reference.model == name)
            query = self.queries.query(model).matching(Among("id", ids))
            query = query.with_select(query.select.column(LinkEndpointColumns.columns(query.table.columns)))
            rows.update((RowRef(name, row.id), row) for row in query.limited(len(ids)))
        return rows

    def endpoint(self, reference: RowRef, rows: dict[RowRef, Model]) -> LinkEndpoint:
        row = rows.get(reference)
        if row is None:
            return LinkEndpoint(reference.model, reference.row_id, f"{reference.model} {reference.row_id} unavailable", False, True, None)
        title = " ".join(str(getattr(row, "title", getattr(row, "line", f"{row.cli_name} {row.id}"))).split())
        target: Model | None = row
        if isinstance(row, TaskLog):
            target = rows.get(RowRef("task", row.task_id))
        elif isinstance(row, Phase):
            target = rows.get(RowRef("plan", row.plan_id))
        open_ref = self.open_ref(target) if target is not None else None
        return LinkEndpoint(reference.model, reference.row_id, title, True, open_ref is None, open_ref)

    def open_ref(self, row: Model) -> str | None:
        entry = self.references.registry.models[row.cli_name]
        if "show" in entry.excluded_subcommands and f"{row.cli_name} show" not in self.references.registry.subcommands:
            return None
        return f"{self.references.tables.table(type(row)).name}:{row.id}"
