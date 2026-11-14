from engine.command.context import Context
from engine.event.updated import Updated
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from core.modules.plugins.models.queued_run import QueuedRun
from core.modules.plugins.support.queued_run_places import QueuedRunPlaces
from core.modules.processes.models.process import Process


class QueuedRunAdmissionListener(SaveListener[Updated[Process]]):
    """A queued run whose process the queue gives its place is running."""

    name = "plugins.queued-run-admission"

    def __init__(self, queries: Queries, places: QueuedRunPlaces) -> None:
        self.queries, self.places = queries, places

    def handle(self, event: Updated[Process], context: Context) -> None:
        process = event.row
        if not process.plugin or not process.is_admitted_after(event.previous):
            return
        run = self.queries.query(QueuedRun).filter(process_id=process.id).first()
        if run is not None:
            self.places.admitted(run, process, context)
