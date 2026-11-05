from collections.abc import Callable, Sequence
from dataclasses import replace

from core.base.actor import CORE_ACTOR_ID, Actor
from core.base.command.context import Context
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.refusal import Refusal
from core.base.repository.repository import Repository


class StandardRows:
    """Brings the rows the journal itself made of one model to what this version comes with, by title: a new one
    is written, an older copy takes the newest words, and one no longer included goes unless it is still used."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def save_all[M: Model](self, model: type[M], standard: Sequence[M], fields: Sequence[str], context: Context, used: Callable[[M], bool] = lambda row: False) -> None:
        stored = {getattr(row, "title"): row for row in self.queries.query(model).filter(creator_id=CORE_ACTOR_ID).all_rows()}
        titles = {getattr(row, "title") for row in standard}
        for title, row in stored.items():
            if title not in titles and not used(row):
                self.repository.delete(row, context)
        for row in standard:
            existing = stored.get(getattr(row, "title"))
            if existing is None:
                self.repository.save(row, context)
            elif any(getattr(existing, field) != getattr(row, field) for field in fields):
                self.repository.save(replace(existing, **{field: getattr(row, field) for field in fields}), context)

    @staticmethod
    def refuse_change(old_row: Model | None, actor: Actor) -> None:
        if old_row is None or getattr(old_row, "creator_id", None) != CORE_ACTOR_ID or actor == Actor.core():
            return
        raise Refusal("this comes with the journal and cannot be changed", "make your own under another title")
