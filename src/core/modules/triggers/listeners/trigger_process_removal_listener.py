from collections.abc import Sequence

from engine.listener.deletion_listener import DeletionListener
from engine.query.conditions.among import Among
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.processes.models.process import Process
from core.modules.triggers.models.trigger_action_run import TriggerActionRun
from engine.event.deleted import Deleted
from engine.command.context import Context

REMOVED_RUNS_REASON = "a removed process takes every trigger run of it with it"


class TriggerProcessRemovalListener(DeletionListener[Deleted[Process]]):
    """Removes trigger action records when their process is removed."""

    name = "triggers.process-removal"

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Deleted[Process], context: Context) -> None:
        self.handle_many([event], context)

    def handle_many(self, events: Sequence[Deleted[Process]], context: Context) -> None:
        process_ids = [event.row.id for event in events]
        self.repository.delete_many_stored(tuple(self.queries.query(TriggerActionRun).matching(Among("process_id", process_ids)).every_row(REMOVED_RUNS_REASON)), context)
