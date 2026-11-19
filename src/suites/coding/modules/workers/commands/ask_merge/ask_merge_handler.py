from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.setting.setting_values import SettingValues
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.agent_messages.unit_merge_waits_message import UnitMergeWaitsMessage
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.support.merge_ask_outcome import MergeAskOutcome
from suites.coding.modules.workers.support.worker_free_task import WorkerFreeTask


class AskMergeHandler(Handler[AskMerge, MergeAskOutcome]):
    """Records a worker's ask for the merge of its whole unit after the checks MergeAskScope made before this write, and delivers
    its worktree ready for the merge, which starts the merger. Just before, while the worktree is still cut so
    the task is not sent at once, it gives the worker the next free task it may take once the merge is done;
    the ask names its tasks before that, so the free task is never part of it.
    An ask up to a task or commit leaves the worktree open and waits for the merger's next visit; with the
    merger off the main agent hears of it."""

    command = AskMerge
    disabled_scopes = [ActorScope]

    def __init__(self, repository: Repository, settings: SettingValues, main_line: MainAgentLine, free_task: WorkerFreeTask) -> None:
        self.repository, self.settings, self.main_line = repository, settings, main_line
        self.free_task = free_task

    def handle(self, command: AskMerge, context: Context) -> MergeAskOutcome:
        part = command.part
        task_ids = ",".join(str(task_id) for task_id in part.task_ids)
        merge_request = self.repository.save(MergeAsk(creator_id=context.actor.id, worktree_id=part.worktree.id, commit_id=part.commit_id, task_ids=task_ids, unit_name=part.unit.merge_name,
                                                  note=command.note, is_full=part.is_full), context)
        worktree = part.worktree
        if part.is_full:
            self.free_task.give_next(command.worker_id, part.task_ids, context)
            worktree = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.deliver, delivered_at=context.timestamp, merge_ready_at=context.timestamp), context)
        if not self.settings.flag(MERGER_ENABLED):
            worker = command.worker_id
            self.main_line.send_agent_message(UnitMergeWaitsMessage.declared().agent_message(worker=worker, merge_ask=merge_request.id), UnitMergeWaitsMessage.declared().key, context)
        return MergeAskOutcome(merge_request, worktree, part.unit)
