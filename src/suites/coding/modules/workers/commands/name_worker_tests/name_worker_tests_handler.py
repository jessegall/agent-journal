from core.base.command.context import Context
from core.base.command.handler import Handler
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.name_worker_tests.name_worker_tests import NameWorkerTests
from suites.coding.modules.workers.models.worker_test_command import WorkerTestCommand


class NameWorkerTestsHandler(Handler[NameWorkerTests, None]):
    """Saves the commands test commands of a worker."""

    command = NameWorkerTests
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, command: NameWorkerTests, context: Context) -> None:
        existing = {row.name: row for row in self.queries.query(WorkerTestCommand).filter(worker_id=command.worker_id).all_rows()}
        for entry in command.commands:
            if entry.name in existing:
                self.repository.save(existing[entry.name].changed(command=entry.command), context)
            else:
                self.repository.save(WorkerTestCommand(worker_id=command.worker_id, name=entry.name, command=entry.command), context)
