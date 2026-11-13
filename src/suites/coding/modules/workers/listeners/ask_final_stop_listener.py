from engine.command.context import Context
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.events.agent_ended import AgentEnded
from suites.coding.models.enums.coding_helper_role import CodingHelperRole
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions
from suites.coding.modules.workers.support.worker_stop import WorkerStop


class AskFinalStopListener(SaveListener[AgentEnded]):
    """The open questions of a worker are closed as moot when a user stops the worker for good. A worker that
    only ends its turn keeps its questions: the answer wakes it."""

    name = "workers.ask-final-stop"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions, stop: WorkerStop) -> None:
        self.questions, self.stop = questions, stop

    def handle(self, event: AgentEnded, context: Context) -> None:
        worker = event.row
        if worker.role == CodingHelperRole.WORKER and self.stop.is_final(worker, context.actor.id):
            self.questions.close_worker_lines(worker.id, "the worker was stopped for good", context)
