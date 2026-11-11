from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.models.agent import AgentEnded
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.ask_ledger import AskLedger
from suites.coding.modules.workers.support.worker_stop import WorkerStop


class AskFinalStopListener(SaveListener[AgentEnded]):
    """The open questions of a worker are closed as moot when a person stops the worker for good. A worker that
    only ends its turn keeps its questions: the answer wakes it."""

    name = "workers.ask-final-stop"
    disabled_scopes = [ActorScope]

    def __init__(self, ledger: AskLedger, stop: WorkerStop) -> None:
        self.ledger, self.stop = ledger, stop

    def handle(self, event: AgentEnded, context: Context) -> None:
        worker = event.row
        if worker.role == CodingHelperRole.WORKER and self.stop.is_final(worker, context.actor.id):
            self.ledger.close_worker_lines(worker.id, "the worker was stopped for good", context)
