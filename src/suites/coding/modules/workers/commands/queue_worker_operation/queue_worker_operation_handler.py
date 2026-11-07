from dataclasses import replace
from core.base.actor import Actor
from core.base.actor_type import ActorType
from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.command_category import CommandCategory
from core.base.listener.event_rows import EventRows
from core.base.repository.repository import Repository
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import Agent
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.processes.commands.start_process.start_process import StartProcess
from suites.coding.modules.workers.commands.queue_worker_operation.queue_worker_operation import QueueWorkerOperation
from suites.coding.modules.workers.models.worker_operation import WorkerOperation
from suites.coding.modules.workers.support.worker_operations import WorkerOperations


class QueueWorkerOperationHandler(Handler[QueueWorkerOperation, WorkerOperation]):
    """Reserves one worker and starts its command through the existing process queue."""

    command = QueueWorkerOperation
    disabled_scopes = [ActorScope]

    def __init__(self, operations: WorkerOperations, bus: Bus, repository: Repository,
                 rows: EventRows, environments: EnvironmentRows) -> None:
        self.operations, self.bus, self.repository = operations, bus, repository
        self.rows, self.environments = rows, environments

    def handle(self, command: QueueWorkerOperation, context: Context) -> WorkerOperation:
        self.operations.check_available(command.worker_id)
        self.bus.handler(command.command).check_rows(command.command, context.actor)
        worker = self.rows.required(Agent, command.worker_id)
        agent_id = context.actor.id if context.actor.type is ActorType.AGENT else worker.id
        folder = self.environments.find(worker.environment_id).folder
        line = f"journal worker-operation run {worker.id}"
        process = self.bus.dispatch(StartProcess.single_part(agent_id, line, folder, CommandCategory.BUILD, 3600), replace(context, actor=Actor.core()))
        return self.repository.save(WorkerOperation(worker_id=worker.id, creator_id=context.actor.id,
                                    actor_type=context.actor.type, process_id=process.id, line=command.line,
                                    plugin_script=command.plugin_script), context)
