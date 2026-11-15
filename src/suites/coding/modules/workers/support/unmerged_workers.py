from core.modules.drivers.support.open_block_rows import OpenBlockRows
from dataclasses import replace

from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers

from engine.driver.nudge import Nudge
from engine.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.nudges.required_command_refusal_nudge import RequiredCommandRefusalNudge
from engine.driver.interval import Interval
from engine.driver.span_queries import SpanQueries
from core.modules.drivers.support.nudge_records import NudgeRecords
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.support.worker_worktrees import WorkerWorktrees
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED, MERGER_WAIT_MINUTES
from suites.coding.modules.workers.nudges.worker_unmerged_nudge import WorkerUnmergedNudge
from suites.coding.modules.workers.nudges.worker_unmerged_due_nudge import WorkerUnmergedDueNudge
from suites.coding.modules.workers.support.work_units import UNIT_TASKS_REASON


from dataclasses import dataclass
from engine.command.command import Command
from engine.driver.hook_event import HookEvent
from engine.request.request_values import RequestValues
from engine.time.clock import Clock

BLOCKING_REMINDER_COUNT = 3
UNMERGED_WORKER_KEY = "workers.unmerged-worker"


@dataclass(frozen=True)
class UnmergedAnswer:
    """The lines that name each worker whose delivered work waits for a merge, and the commands that close the merge
    holds of workers that no longer wait."""

    nudges: tuple[Nudge, ...]
    stale: tuple[Command[object], ...]


class UnmergedWorkers:
    """Names to the main agent each worker whose delivered work is not merged or released, with its tasks, again after
    the interval of the line; from the third reminder on, the line requires the merge, so it holds the agent until it
    merges or gives a reason, and a reason passes only that hold. With the merger on, a worker is named once the merger
    has had the wait setting's minutes to take it in, or at once when the merger left it to the main agent."""

    def __init__(self, delivered: WorkerWorktrees, tasks: TaskQuery, proofs: ProofQuery, records: NudgeRecords, settings: SettingValues, queries: Queries, spans: SpanQueries,
                 numbers: RowNumbers, clock: Clock, request_values: RequestValues, open_blocks: OpenBlockRows) -> None:
        self.numbers, self.clock, self.request_values, self.open_blocks = numbers, clock, request_values, open_blocks
        self.settings, self.queries, self.spans = settings, queries, spans
        self.delivered, self.tasks, self.proofs, self.records = delivered, tasks, proofs, records

    def merge_command(self, worktree: Worktree) -> str:
        return f"journal worker merge {self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)}"

    def answer(self, event: HookEvent | None, agent_id: int) -> UnmergedAnswer:
        firing = event.firing if event is not None else "step"
        # read once a step, so the lines and the holds they close agree
        return self.request_values.read(f"workers.unmerged:{agent_id}:{firing}", lambda: firing, lambda: self.found(agent_id))

    def found(self, agent_id: int) -> UnmergedAnswer:
        nudges: list[Nudge] = []
        delivered = self.delivered.delivered()
        for worktree in delivered:
            if self.is_with_merger(worktree, agent_id):
                continue
            proofs = tuple(self.proofs.waiting_proofs(worktree.id).every_row(UNIT_TASKS_REASON))
            action = f"{self.merge_command(worktree)}, or journal worker release {self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)}"
            if proofs:
                action = f"journal proof check {', '.join(str(proof.id) for proof in proofs)}"
            key = f"{WorkerUnmergedNudge.declared().key}.{worktree.session_agent_id}"
            declaration = WorkerUnmergedDueNudge.declared() if self.delivered_reminder_count(agent_id, key) >= BLOCKING_REMINDER_COUNT - 1 else WorkerUnmergedNudge.declared()
            nudges.append(replace(declaration.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), tasks=self.task_names(worktree), action=action), key=key))
        commands = {self.merge_command(worktree) for worktree in delivered}
        prefix = f"{RequiredCommandRefusalNudge.declared().key}:journal worker merge "
        blocks = self.open_blocks.rows(agent_id)
        stale = tuple(CloseAgentBlock(block.id) for block in blocks if block.nudge_key.startswith(prefix) and block.condition_text not in commands)
        return UnmergedAnswer(tuple(nudges), stale)

    def is_with_merger(self, worktree: Worktree, agent_id: int) -> bool:
        if not self.settings.flag(MERGER_ENABLED) or worktree.returned_at is not None:
            return False
        if worktree.merge_ready_at is None:
            return True
        return not Interval(self.settings.minutes(MERGER_WAIT_MINUTES)).has_passed(self.spans, agent_id, worktree.merge_ready_at, self.clock.timestamp())

    def delivered_reminder_count(self, agent_id: int, key: str) -> int:
        record = self.records.newest_row(agent_id, key)
        return record.delivery_count if record is not None else 0

    def task_names(self, worktree: Worktree) -> str:
        proved_ids = {proof.task_id for proof in self.proofs.worktree_proofs(worktree.id).every_row(UNIT_TASKS_REASON)}
        unclosed_ids = {task.id for task in self.tasks.assignee_tasks(worktree.session_agent_id).unclosed().every_row(UNIT_TASKS_REASON)}
        return ", ".join(f"task:{task_id}" for task_id in sorted(proved_ids | unclosed_ids))
