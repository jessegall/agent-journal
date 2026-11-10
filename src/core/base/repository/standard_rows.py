from functools import partial
from collections.abc import Callable, Sequence

from engine.actor.actor import CORE_ACTOR_ID, Actor
from core.base.command.context import Context
from core.base.database.kept_rows import KeptRows
from core.base.model.model import Model
from core.base.query.queries import Queries
from engine.errors.refusal import Refusal
from core.base.repository.repository import Repository


class StandardRows:
    """Brings the rows the journal itself made of one model to what this version comes with, by title: a new one
    is written, an older copy takes the newest words, and one no longer included goes unless it is still used."""

    def __init__(self, queries: Queries, repository: Repository, kept: KeptRows) -> None:
        self.queries, self.repository, self.kept = queries, repository, kept

    def save_all[M: Model](self, model: type[M], standard: Sequence[M], fields: Sequence[str], context: Context, used: Callable[[M], bool] = lambda row: False) -> None:
        query = self.queries.query(model).filter(creator_id=CORE_ACTOR_ID)
        stored = self.kept.read(query.table.name, lambda: {getattr(row, "title"): row for row in query.all_rows()},
                                "creator_id = ?", [CORE_ACTOR_ID], name="standard.rows")
        titles = {getattr(row, "title") for row in standard}
        for row in [row for title, row in stored.items() if title not in titles and not used(row)]:
            self.repository.delete_stored(row, context)
            self.kept.update(query.table.name, partial(self.without_row, row), "creator_id = ?", [CORE_ACTOR_ID], name="standard.rows")
        for row in standard:
            existing = stored.get(getattr(row, "title"))
            if existing is not None and not any(getattr(existing, field) != getattr(row, field) for field in fields):
                continue
            if existing is None:
                saved = self.repository.save(row, context)
            else:
                saved = self.repository.update(existing, context, **{field: getattr(row, field) for field in fields})
            self.kept.update(query.table.name, partial(self.with_row, saved), "creator_id = ?", [CORE_ACTOR_ID], name="standard.rows")

    @staticmethod
    def without_row[M: Model](row: M, rows: dict[str, M]) -> dict[str, M]:
        return {title: current for title, current in rows.items() if current.id != row.id}

    @staticmethod
    def with_row[M: Model](row: M, rows: dict[str, M]) -> dict[str, M]:
        return {**rows, getattr(row, "title"): row}

    @staticmethod
    def refuse_change(old_row: Model | None, actor: Actor) -> None:
        if old_row is None or getattr(old_row, "creator_id", None) != CORE_ACTOR_ID or actor == Actor.core():
            return
        raise Refusal("this comes with the journal and cannot be changed", "make your own under another title")
