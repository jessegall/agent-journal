from core.base.query.conditions.is_null import IsNull
from core.base.query.queries import Queries
from core.base.query.query import Query
from core.modules.processes.models.process_queue_row import ProcessQueueRow


class ActiveQueueRuns:
    """The runs the process queue holds: those that take a slot or wait for one and have not ended. A journal
    line or a short read is never among them."""

    def __init__(self, queries: Queries) -> None:
        self.queries = queries

    def query(self) -> Query[ProcessQueueRow]:
        return self.queries.query(ProcessQueueRow).filter(is_queue_run=True).matching(IsNull("ended_at"))
