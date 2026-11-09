from core.base.listener.deletion_listener import DeletionListener
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from core.base.change.deleted import Deleted
from core.base.command.context import Context


class TriggerProcessRemovalListener(DeletionListener[Deleted[Process]]):
    """Removes trigger action records when their process is removed."""

    name = "triggers.process-removal"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Process], context: Context) -> None:
        process = event.row
        runs = tuple(self.queries.query(TriggerActionRun).filter(process_id=process.id).all_rows())
        for run in runs:
            self.repository.delete(run, context)
