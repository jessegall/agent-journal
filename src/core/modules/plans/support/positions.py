from engine.command.context import Context
from engine.query.conditions.greater import Greater
from engine.query.queries import Queries
from engine.repository.repository import Repository
from typing import TypeVar
from engine.model.positioned import Positioned
from engine.errors.refusal import Refusal

RENUMBER_REASON = "positions stay without gaps, so every row after a moved one is numbered again"

P = TypeVar("P", bound=Positioned)

POSITION = "position"


class Positions:
    """Keeps a parent's numbered positions without gaps when rows are added, moved or deleted."""

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def next_position(self, model: type[Positioned], parent_column: str, parent_id: int) -> int:
        highest = self.queries.query(model).filter(**{parent_column: parent_id}).descending(POSITION).first()
        return highest.position + 1 if highest is not None else 1

    def renumber(self, model: type[Positioned], parent_column: str, parent_id: int, position: int, context: Context) -> None:
        later = self.queries.query(model).filter(**{parent_column: parent_id}).matching(Greater(POSITION, position))
        for row in sorted(later.every_row(RENUMBER_REASON), key=lambda row: row.position):
            self.repository.save(row.changed(position=row.position - 1), context)

    def move(self, row: P, parent_column: str, parent_id: int, position: int, context: Context) -> P:
        rows = tuple(sorted(self.queries.query(type(row)).filter(**{parent_column: parent_id}).every_row(RENUMBER_REASON), key=lambda row: row.position))
        if not 1 <= position <= len(rows):
            parent = parent_column.removesuffix("_id")
            raise Refusal(f"{parent} {parent_id} has places 1 to {len(rows)}, not {position}")
        old_position = row.position
        moved = self.repository.update(row, context, position=len(rows) + 1)
        step = 1 if position < old_position else -1
        affected_rows = [sibling for sibling in rows if sibling.id != row.id and min(old_position, position) <= sibling.position <= max(old_position, position)]
        for sibling in sorted(affected_rows, key=lambda sibling: sibling.position, reverse=step == 1):
            self.repository.update(sibling, context, position=sibling.position + step)
        return self.repository.update(moved, context, position=position)
