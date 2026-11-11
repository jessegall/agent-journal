from engine.command.context import Context
from engine.event.moved import Moved
from engine.listener.save_listener import SaveListener
from engine.query.queries import Queries
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.models.enums.merge_ask_state import MergeAskState
from suites.coding.modules.workers.models.lifecycles.merge_ask_lifecycle import MergeAskLifecycle
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.models.worktree import Worktree


class MergeAskReturnListener(SaveListener[Moved[Worktree]]):
    """Any return of a worktree from its merge sends its waiting ask back, so the worker asks again."""

    name = "workers.merge-ask-return"
    moves = tuple([WorktreeLifecycle.rework])
    disabled_scopes = [ActorScope]

    def __init__(self, queries: Queries, repository: Repository) -> None:
        self.queries, self.repository = queries, repository

    def handle(self, event: Moved[Worktree], context: Context) -> None:
        waiting = self.queries.query(MergeAsk).filter(worktree_id=event.row.id, state=MergeAskState.WAITING).first()
        if waiting is None:
            return
        self.repository.save_change(waiting, waiting.moved(MergeAskLifecycle.send_back), context)
