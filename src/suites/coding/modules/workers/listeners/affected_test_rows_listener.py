from engine.change.changed import Changed
from engine.change.deleted import Deleted
from engine.command.context import Context
from core.base.listener.save_listener import SaveListener
from suites.coding.modules.workers.models.affected_test import AffectedTest
from suites.coding.modules.workers.support.affected_test_rows import AffectedTestRows


class AffectedTestRowsListener(SaveListener[Changed[AffectedTest]]):
    name = "workers.affected-test-rows"

    def __init__(self, rows: AffectedTestRows) -> None:
        self.rows = rows

    def handle(self, event: Changed[AffectedTest], context: Context) -> None:
        if isinstance(event, Deleted):
            self.rows.remove(event.row)
            return
        self.rows.save(event.row)
