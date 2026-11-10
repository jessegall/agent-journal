from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from core.modules.processes.commands.set_output_timeout.set_output_timeout import SetOutputTimeout
from core.modules.processes.models.enums.process_state import RUNNING_STATES
from core.modules.processes.models.process import Process
from core.modules.processes.support.output_access import OutputAccess


class SetOutputTimeoutHandler(Handler[SetOutputTimeout, Process]):
    """Sets a future timeout without changing an already passed limit."""

    command = SetOutputTimeout

    def __init__(self, access: OutputAccess, repository: Repository) -> None:
        self.access, self.repository = access, repository

    def handle(self, command: SetOutputTimeout, context: Context) -> Process:
        process = self.access.process(context.actor, command.process_id)
        if process.state not in RUNNING_STATES:
            raise Refusal(f"output {process.id} is not running", "set a timeout on a running output")
        if process.started_at is not None and command.duration.has_passed(process.started_at, context.timestamp):
            raise Refusal(f"the timeout for output {process.id} has already passed", "choose a longer duration; the run is unchanged")
        return self.repository.update(process, context, timeout_seconds=command.duration.seconds)
