from collections.abc import Mapping

from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.query.queries import Queries
from core.base.registry.registry import Registry


class WaitTargets:
    """Names the row a wait target points at and tells whether it is already done: a row whose lifecycle has left its
    editable states. `words` are other names for a table, which a module that owns the row's model adds in a subclass
    it binds to this one, together with the way to say what a done row ended with."""

    words: Mapping[str, str] = {}

    def __init__(self, registry: Registry, tables: Tables, queries: Queries, book: StateBook) -> None:
        self.registry, self.tables, self.queries, self.book = registry, tables, queries, book

    def table(self, word: str) -> str:
        """The table a target's table word stands for; a word no table has stays as written."""
        return self.words.get(word, word)

    def done_row(self, word: str, row_id: int) -> Model | None:
        """The row a target names when it exists and has already left its editable states."""
        model = self.model(self.table(word))
        lifecycle = self.book.lifecycle(model) if model is not None else None
        row = self.queries.query(model).filter(id=row_id).first() if model is not None else None
        if row is None or lifecycle is None or getattr(row, "state", None) in lifecycle.editable:
            return None
        return row

    def model(self, table: str) -> type[Model] | None:
        for entry in self.registry.models.values():
            model = entry.model.checked_class(Model)
            if self.tables.table(model).name == table:
                return model
        return None

    def result(self, row: Model, reference: str) -> str:
        """What a done row ended with, as the refusal of a wait on it says."""
        state = getattr(row, "state", None)
        return f"{reference} is already {getattr(state, 'value', state)}"
