from dataclasses import replace
from engine.actor.actor import Actor
from engine.command.bus import Bus
from engine.command.context import Context
from engine.command.handler import Handler
from engine.enums.command_category import CommandCategory
from engine.listener.event_rows import EventRows
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.messages.support.work_sources import WorkSources
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.commands.queue_worker_operation.queue_worker_operation import QueueWorkerOperation
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.queries.worker_operation_query import WorkerOperationQuery


class QueueWorkerOperationHandler(Handler[QueueWorkerOperation, WorkerOperation]):
    """Reserves one worker and starts its command through the existing process queue."""

    command = QueueWorkerOperation
    disabled_scopes = [ActorScope]

    def __init__(self, operations: WorkerOperationQuery, bus: Bus, repository: Repository,
                 rows: EventRows, environments: EnvironmentRows, sources: WorkSources) -> None:
        self.operations, self.bus, self.repository = operations, bus, repository
        self.rows, self.environments = rows, environments
        self.sources = sources

    def handle(self, command: QueueWorkerOperation, context: Context) -> WorkerOperation:
        self.operations.check_available(command.worker_id)
        self.bus.handler(command.command).check_rows(command.command, context.actor)
        worker = self.rows.required(Agent, command.worker_id)
        source = self.sources.source_copy(replace(context, environment_id=worker.environment_id))
        folder = self.environments.find(worker.environment_id).folder
        line = f"journal worker-operation run {worker.id}"
        process = self.bus.dispatch(StartProcess.single_part(worker.id, line, folder, CommandCategory.BACKGROUND_JOB, 3600), replace(context, actor=Actor.core()))
        return self.repository.save(WorkerOperation(worker_id=worker.id, creator_id=context.actor.id,
                                    actor_type=context.actor.type, process_id=process.id, line=command.line, name=command.name,
                                    source_message_id=source.message_id, source_version=source.version,
                                    source_unavailable=source.unavailable, selecting_actor_id=source.selecting_actor_id,
                                    source_origin=source.origin,
                                    plugin_script=command.plugin_script), context)
