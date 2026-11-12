from engine.actor.actor import Actor
from engine.command.context import Context
from engine.command.handler import Handler
from engine.repository.repository import Repository
from engine.scope.actor_scope import ActorScope
from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers
from engine.setting.setting_values import SettingValues
from core.modules.drivers.support.main_agent_line import MainAgentLine
from suites.coding.modules.workers.support.merger_nudges import UNIT_MERGE_WAITS
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED
from suites.coding.modules.workers.commands.ask_merge.ask_merge import AskMerge
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merge_ask import MergeAsk
from suites.coding.modules.workers.support.merge_ask_outcome import MergeAskOutcome
from suites.coding.modules.workers.support.merge_ask_scope import MergeAskScope


class AskMergeHandler(Handler[AskMerge, MergeAskOutcome]):
    """Records a worker's ask for the merge of its whole unit after the checks of MergeAskScope, and delivers
    its worktree ready for the merge, which starts the merger; an ask up to a task or commit leaves the
    worktree open and waits for the merger's next visit; with the merger off the main agent hears of it."""

    command = AskMerge
    disabled_scopes = [ActorScope]

    def __init__(self, scope: MergeAskScope, repository: Repository, settings: SettingValues, main_line: MainAgentLine, numbers: RowNumbers) -> None:
        self.scope, self.repository, self.settings, self.main_line, self.numbers = scope, repository, settings, main_line, numbers

    def check_rows(self, command: AskMerge, actor: Actor) -> None:
        self.scope.checked(command.worker_id, command.note, command.up_to)

    def handle(self, command: AskMerge, context: Context) -> MergeAskOutcome:
        part = self.scope.checked(command.worker_id, command.note, command.up_to)
        task_ids = ",".join(str(task_id) for task_id in part.task_ids)
        merge_ask = self.repository.save(MergeAsk(creator_id=context.actor.id, worktree_id=part.worktree.id, commit_id=part.commit_id, task_ids=task_ids, unit_name=part.unit.merge_name,
                                                  note=command.note, is_whole=part.is_whole), context)
        worktree = part.worktree
        if part.is_whole:
            worktree = self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.deliver, delivered_at=context.timestamp, merge_ready_at=context.timestamp), context)
        if not self.settings.flag(MERGER_ENABLED):
            worker = self.numbers.number(AGENT_MODEL_NAME, command.worker_id)
            self.main_line.send_nudge(UNIT_MERGE_WAITS.nudge(worker=worker, merge_ask=merge_ask.id), UNIT_MERGE_WAITS.key, context)
        return MergeAskOutcome(merge_ask, worktree, part.unit)
