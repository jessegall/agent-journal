from dataclasses import replace

from core.base.change.change import Change
from core.base.listener.save_listener import SaveListener
from core.base.model.model import Model
from core.base.model.tables import Tables
from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.waits.wait import Wait
from core.modules.waits.wait_state import WaitState
from core.modules.waits.wait_target import WaitTarget


class TargetResolutionListener(SaveListener):
    """A row a wait waits on resolves when it leaves its lifecycle's editable states; the wait ends once none of its
    rows is left open."""

    name = "waits.end-when-resolved"
    event = "*.*"

    def __init__(self, queries: Queries, repository: Repository, tables: Tables) -> None:
        self.queries, self.repository, self.tables = queries, repository, tables

    def handle(self, change: Change[Model]) -> None:
        row = change.row
        lifecycle = type(row).lifecycle
        if isinstance(row, (Wait, WaitTarget)) or lifecycle is None or getattr(row, "state", None) in lifecycle.editable:
            return
        table = self.tables.table(type(row)).name
        targets = tuple(self.queries.query(WaitTarget).filter(row_table=table, row_id=row.id).matching(IsNull("resolved_at")).all_rows())
        for target in targets:
            self.repository.save(replace(target, resolved_at=change.context.timestamp), change.context)
            self.ended(target.wait_id, f"{target.ref} is done", change)

    def ended(self, wait_id: int, outcome: str, change: Change[Model]) -> None:
        wait = self.queries.query(Wait).find(wait_id)
        open_targets = self.queries.query(WaitTarget).filter(wait_id=wait_id).matching(IsNull("resolved_at")).exists()
        if wait.state is WaitState.OPEN and not open_targets:
            self.repository.save(wait.end(change.context.timestamp, change.context.actor, outcome), change.context)
