from pathlib import Path

from journal.features.migration.support.environment_kind import EnvironmentKind
from journal.features.migration.support.version_3_row import Version3Row
from journal.support.actor import Actor
from journal.models.environment import Environment
from journal.models.worker import Worker
from journal.models.worker_state import WorkerState
from journal.repositories.environments import Environments
from journal.repositories.migrated_rows import MigratedRows
from journal.repositories.workers import Workers


class HelperImport(EnvironmentKind):
    """A version 3 helper is history here: a stopped worker of its name, provider and model, with its job as its brief."""

    kind = "helper"
    title = "workers"

    def __init__(self, environments: Environments, tally: MigratedRows, workers: Workers) -> None:
        super().__init__(environments, tally)
        self.workers = workers

    def created(self, row: Version3Row, target: Environment, attached: Path, actor: Actor) -> Worker:
        worker = Worker(environment_id=target.id, name=row.data.get("name", row.title), brief=row.brief, provider=row.data.get("provider", "claude"), model=row.data.get("model", ""), state=WorkerState.STOPPED)
        return self.workers.imported(worker, row.created_at(), actor)
