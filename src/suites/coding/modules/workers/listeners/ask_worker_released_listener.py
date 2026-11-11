from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions

class AskWorkerReleasedListener(SaveListener[Changed[Worktree]]):
    """The open questions of a worker are closed as moot once the worker is released or its worktree removed."""

    name = "workers.ask-worker-released"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions) -> None:
        self.questions = questions

    def handle(self, event: Changed[Worktree], context: Context) -> None:
        old, new = event.old_row, event.row
        if old is not None and new.is_released_since(old):
            self.questions.close_worker_lines(new.session_agent_id, "the worker was released", context)
