from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.support.merge_ask_outcome import MergeAskOutcome
from suites.coding.modules.workers.support.merge_ask_scope import MergeAskScope


class AskMergeHandler(Handler[AskMerge, MergeAskOutcome]):
    """Records a worker's ask for the merge of its whole unit after the checks of MergeAskScope, and delivers
    its worktree ready for the merge, which starts the merger."""

    command = AskMerge
    disabled_scopes = [ActorScope]

    def __init__(self, scope: MergeAskScope, repository: Repository) -> None:
        self.scope, self.repository = scope, repository

    def check_rows(self, command: AskMerge, actor: Actor) -> None:
        self.scope.checked(command.worker_id, command.note)

    def handle(self, command: AskMerge, context: Context) -> MergeAskOutcome:
        worktree, unit = self.scope.checked(command.worker_id, command.note)
        task_ids = ",".join(str(task_id) for task_id in unit.task_ids)
        merge_ask = self.repository.save(MergeAsk(creator_id=context.actor.id, worktree_id=worktree.id, commit_id=worktree.commit_short_id, task_ids=task_ids,
                                                  note=command.note, is_whole=True), context)
        delivered = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.deliver, delivered_at=context.timestamp, merge_ready_at=context.timestamp), context)
        return MergeAskOutcome(merge_ask, delivered, unit)
