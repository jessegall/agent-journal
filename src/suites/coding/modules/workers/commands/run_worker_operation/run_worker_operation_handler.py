import io
import shlex

from core.base.actor import Actor
from core.base.caller.caller import Caller
from core.base.cli.console import Console
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.listener.event_rows import EventRows
from core.base.refusal import Refusal
from core.base.scope.actor_scope import ActorScope
from core.modules.processes.models.process import Process
from core.modules.messages.support.work_sources import WorkSources
from suites.coding.modules.workers.commands.run_worker_operation.run_worker_operation import RunWorkerOperation


class RunWorkerOperationHandler(Handler[RunWorkerOperation, str]):
    """Runs a claimed worker command with its original caller and writes its result to the process output."""

    command = RunWorkerOperation
    disabled_scopes = [ActorScope]

    def __init__(self, console: Console, rows: EventRows, sources: WorkSources) -> None:
        self.console, self.rows, self.sources = console, rows, sources

    def handle(self, command: RunWorkerOperation, context: Context) -> str:
        operation = command.operation
        process = self.rows.required(Process, operation.process_id)
        caller = Caller(Actor(operation.creator_id, operation.actor_type), process.environment_id,
                        operation.plugin_script, operation.process_id)
        stream = io.StringIO()
        with self.sources.source_scope(operation.source_copy(process.environment_id), caller.actor):
            code = self.console.run(shlex.split(operation.line), caller, stream)
        text = stream.getvalue().strip()
        if code:
            raise Refusal(text)
        return text
