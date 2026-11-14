import io
import shlex

from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.cli.console import Console
from engine.command.context import Context
from engine.command.handler import Handler
from engine.listener.rows.event_rows import EventRows
from engine.errors.refusal import Refusal
from engine.scope.actor_scope import ActorScope
from core.modules.processes.models.process import Process
from core.modules.messages.support.work_sources import WorkSources
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation import RunWorkerOperation


class RunWorkerOperationHandler(Handler[RunWorkerOperation, str]):
    """Runs a claimed worker command with its original caller and writes its result to the process output."""

    command = RunWorkerOperation
    disabled_scopes = [ActorScope]
    runs_once = True

    def __init__(self, console: Console, rows: EventRows, sources: WorkSources) -> None:
        self.console, self.rows, self.sources = console, rows, sources
        self.output = io.StringIO()

    def prepare(self, command: RunWorkerOperation, actor: Actor) -> None:
        operation = command.operation
        process = self.rows.required(Process, operation.process_id)
        caller = Caller(Actor(operation.creator_id, operation.actor_type), process.environment_id,
                        operation.plugin_script, operation.process_id)
        self.output = io.StringIO()
        with self.sources.source_scope(operation.source_copy(process.environment_id), caller.actor):
            code = self.console.run(shlex.split(operation.line), caller, self.output)
        if code:
            raise Refusal(self.output.getvalue().strip())

    def handle(self, command: RunWorkerOperation, context: Context) -> str:
        return self.output.getvalue().strip()
