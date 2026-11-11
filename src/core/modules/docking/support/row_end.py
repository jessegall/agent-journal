from engine.model.model import Model
from engine.model.state_book import StateBook
from engine.listener.rows.event_rows import EventRows
from engine.errors.missing_rows_error import MissingRowsError
from engine.registry.registry import Registry
from core.modules.docking.models.dock_item import DockItem


class RowEnd:
    """Whether the row an item points at has ended: it is gone, it has no lifecycle, or it stands in a
    state that only moves back to a first state, such as a closed task that can be reopened."""

    def __init__(self, registry: Registry, rows: EventRows, book: StateBook) -> None:
        self.registry, self.rows, self.book = registry, rows, book

    def ended(self, item: DockItem) -> bool:
        entry = self.registry.models.get(item.target_model)
        if entry is None:
            return True
        model = entry.model.checked_class(Model)
        try:
            row = self.rows.required(model, item.target_id)
        except MissingRowsError:
            return True
        lifecycle = self.book.lifecycle(model)
        if lifecycle is None:
            return True
        return all(move.target in lifecycle.initial for move in lifecycle.outgoing_moves(row.current_state()))
