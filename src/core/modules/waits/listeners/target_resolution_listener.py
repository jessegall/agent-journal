from core.base.database.kept_rows import KeptRows
from core.base.listener.event_rows import EventRows
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.model.state_book import StateBook
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.waits.models.wait import Wait
from core.modules.waits.models.enums.wait_state import WaitState
from core.modules.waits.models.wait_target import WaitTarget
from core.base.change.changed import Changed
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class TargetResolutionListener(SaveListener[Changed[Model]]):
    """A row a wait waits on resolves when it leaves its lifecycle's editable states; the wait ends once
    none of its rows is left open."""

    name = "waits.end-when-resolved"

    def __init__(self, queries: Queries, repository: Repository, tables: Tables, book: StateBook, kept: KeptRows, rows: EventRows) -> None:
        self.queries, self.repository, self.tables, self.book = queries, repository, tables, book
        self.kept, self.rows = kept, rows

    def handle(self, event: Changed[Model], context: Context) -> None:
        row = event.row
        if isinstance(row, WaitTarget):
            pending = tuple([row]) if row.resolved_at is None and not isinstance(event, Deleted) else ()
            self.kept.update("wait_targets", lambda targets: (*[target for target in targets if target.id != row.id], *pending),
                             "row_table = ? AND row_id = ? AND resolved_at IS NULL", [row.row_table, row.row_id], name="waits.open_targets")
            return
        lifecycle = self.book.lifecycle(type(row))
        if isinstance(row, Wait) or lifecycle is None or getattr(row, "state", None) in lifecycle.editable:
            return
        table = self.tables.table(type(row)).name
        targets = self.kept.read("wait_targets", lambda: tuple(self.queries.query(WaitTarget).filter(row_table=table, row_id=row.id).matching(IsNull("resolved_at")).all_rows()),
                                 "row_table = ? AND row_id = ? AND resolved_at IS NULL", [table, row.id], name="waits.open_targets")
        for target in targets:
            self.repository.update(target, context, resolved_at=context.timestamp)
            self.ended(target.wait_id, f"{target.ref} is done", context)

    def ended(self, wait_id: int, outcome: str, context: Context) -> None:
        wait = self.rows.required(Wait, wait_id)
        open_targets = self.queries.query(WaitTarget).filter(wait_id=wait_id).matching(IsNull("resolved_at")).exists()
        if wait.state is WaitState.OPEN and not open_targets:
            self.repository.save_change(wait, wait.end(context.timestamp, context.actor, outcome), context)
