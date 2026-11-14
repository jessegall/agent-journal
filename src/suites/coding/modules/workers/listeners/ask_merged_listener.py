from engine.command.context import Context
from engine.event.changed import Changed
from engine.listener.save_listener import SaveListener
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.models.enums.ask_outcome import AskOutcome
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_questions import WorkerQuestions

MERGED_TEXT = "the work was merged"


class AskMergedListener(SaveListener[Changed[Worktree]]):
    """The questions of a worker that went to the main agent end as fixed once its work is merged."""

    name = "workers.ask-merged"
    disabled_scopes = [ActorScope]

    def __init__(self, questions: WorkerQuestions) -> None:
        self.questions = questions

    def handle(self, event: Changed[Worktree], context: Context) -> None:
        old, new = event.old_row, event.row
        if old is not None and old.state is not WorktreeState.MERGED and new.state is WorktreeState.MERGED:
            self.questions.settle_forwarded(new.session_agent_id, AskOutcome.FIXED, MERGED_TEXT, context)
