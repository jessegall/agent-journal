from pathlib import Path

from journal.features.migration.environment_kind import EnvironmentKind
from journal.features.migration.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.workers import Workers


class BringHelpers(EnvironmentKind):
    """A version 3 helper is history here: a stopped worker of its name, provider and model, with its job as its brief."""

    kind = "helper"
    title = "workers"

    def __init__(self, environments: Environments, ledger: MigratedRows, workers: Workers) -> None:
        super().__init__(environments, ledger)
        self.workers = workers

    def made(self, row: Version3Row, into: Environment, attached: Path, by: Actor) -> Worker:
        worker = Worker(environment_id=into.id, name=row.data.get("name", row.title), brief=row.brief, provider=row.data.get("provider", "claude"), model=row.data.get("model", ""), state=WorkerState.STOPPED)
        return self.workers.imported(worker, row.made_at(), by)
