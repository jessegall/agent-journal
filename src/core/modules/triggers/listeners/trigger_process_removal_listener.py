from core.base.change.change import Change
from core.base.listener.deletion_listener import DeletionListener
from core.base.model.model import Model
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.triggers.models.trigger_action_run import TriggerActionRun


class TriggerProcessRemovalListener(DeletionListener):
    """Removes trigger action records when their process is removed."""

    name = "triggers.process-removal"
    event = "process.delete"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, change: Change[Model]) -> None:
        process = change.row
        if not isinstance(process, Process):
            return
        runs = tuple(self.queries.query(TriggerActionRun).filter(process_id=process.id).all_rows())
        for run in runs:
            self.repository.delete(run, change.context)
