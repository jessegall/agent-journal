from collections.abc import Mapping

from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.registry.registry import Registry


class WaitTargets:
    """Names the row a wait target points at and tells whether it is already done: a row whose lifecycle has
    left its editable states. A target's word is the name of a model, of its table, or one of `words`,
    other names for a table, which a module that owns the row's model adds in a subclass it binds to this
    one, together with the way to say what a done row ended with."""

    aliases: Mapping[str, str] = {}

    def __init__(self, registry: Registry, tables: Tables, queries: Queries, book: StateBook) -> None:
        self.registry, self.tables, self.queries, self.book = registry, tables, queries, book

    def table(self, model: type[Model]) -> str:
        return self.tables.table(model).name

    def registered_names(self) -> tuple[str, ...]:
        models = [cli_name for cli_name, entry in self.registry.models.items() if self.book.lifecycle(entry.model.checked_class(Model)) is not None]
        return tuple(sorted({*models, *self.aliases}))

    def ended_row(self, model: type[Model], row_id: int) -> Model | None:
        lifecycle = self.book.lifecycle(model)
        row = self.queries.query(model).filter(id=row_id).first()
        if row is None or lifecycle is None or getattr(row, "state", None) in lifecycle.editable:
            return None
        return row

    def model(self, word: str) -> type[Model] | None:
        name = self.aliases.get(word, word)
        for cli_name, entry in self.registry.models.items():
            model = entry.model.checked_class(Model)
            if name in (cli_name, model.model_name, self.table(model)):
                return model
        return None

    def result(self, row: Model, reference: str) -> str:
        state = getattr(row, "state", None)
        return f"{reference} is already {getattr(state, 'value', state)}"
