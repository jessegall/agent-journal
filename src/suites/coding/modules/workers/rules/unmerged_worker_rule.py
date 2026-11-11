from dataclasses import replace

from engine.cli.agent_number import AGENT_MODEL_NAME
from engine.cli.row_numbers import RowNumbers

from engine.driver.nudge import Nudge
from engine.query.conditions.is_null import IsNull
from engine.query.queries import Queries
from core.modules.drivers.commands.close_agent_block.close_agent_block import CloseAgentBlock
from core.modules.drivers.models.agent_block import AgentBlock, OPEN_BLOCKS_REASON
from core.modules.drivers.support.driver_nudges import REQUIRED_COMMAND_REFUSAL
from engine.enums.agent_role import AgentRole
from engine.driver.agent_hook import AgentHook
from engine.driver.driver_rule import DriverRule
from engine.enums.hook_event_name import HookEventName
from engine.driver.interval import Interval
from engine.driver.rule_answer import RuleAnswer
from engine.driver.span_queries import SpanQueries
from core.modules.drivers.support.nudge_records import NudgeRecords
from core.modules.tasks.queries.task_query import TaskQuery
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.proof_query import ProofQuery
from suites.coding.modules.workers.rules.support.worker_worktrees import WorkerWorktrees
from engine.setting.setting_values import SettingValues
from suites.coding.modules.workers.support.worker_settings import MERGER_ENABLED, MERGER_WAIT_MINUTES
from suites.coding.modules.workers.support.worker_nudges import WORKER_UNMERGED, WORKER_UNMERGED_DUE

BLOCKING_REMINDER_COUNT = 3


class UnmergedWorkerRule(DriverRule):
    """A tick names to the main agent each worker whose delivered work is not merged or released, with its
    tasks, again after the interval of the line; from the third reminder on, each one holds the agent until
    it merges or gives a reason, and a reason passes only that hold. With the merger on, a worker is named
    once the merger has had the wait setting's minutes to take it in, or at once when the merger left it to
    the main agent."""

    name = "workers.unmerged-worker"
    hook = HookEventName.TICK
    drivers = ["coding.main"]
    roles = [AgentRole.MAIN]

    def __init__(self, delivered: WorkerWorktrees, tasks: TaskQuery, proofs: ProofQuery, records: NudgeRecords, settings: SettingValues, queries: Queries, spans: SpanQueries, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.settings, self.queries, self.spans = settings, queries, spans
        self.delivered, self.tasks, self.proofs, self.records = delivered, tasks, proofs, records

    def merge_command(self, worktree: Worktree) -> str:
        return f"journal worker merge {self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)}"

    def answer(self, hook: AgentHook) -> RuleAnswer:
        nudges: list[Nudge] = []
        delivered = self.delivered.delivered()
        for worktree in delivered:
            if self.is_with_merger(worktree, hook):
                continue
            proofs = tuple(self.proofs.waiting_proofs(worktree.id).oldest().all_rows())
            action = f"{self.merge_command(worktree)}, or journal worker release {self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id)}"
            if proofs:
                action = f"journal proof check {', '.join(str(proof.id) for proof in proofs)}"
            key = f"{WORKER_UNMERGED.key}.{worktree.session_agent_id}"
            declaration = WORKER_UNMERGED_DUE if self.delivered_reminder_count(hook.agent_id, key) >= BLOCKING_REMINDER_COUNT - 1 else WORKER_UNMERGED
            nudges.append(replace(declaration.nudge(worker=self.numbers.number(AGENT_MODEL_NAME, worktree.session_agent_id), tasks=self.task_names(worktree.session_agent_id), action=action), key=key))
        commands = {self.merge_command(worktree) for worktree in delivered}
        prefix = f"{REQUIRED_COMMAND_REFUSAL.key}:journal worker merge "
        blocks = self.queries.query(AgentBlock).filter(session_agent_id=hook.agent_id).matching(IsNull("closed_at")).full_table(OPEN_BLOCKS_REASON).all_rows()
        stale = [CloseAgentBlock(block.id) for block in blocks if block.nudge_key.startswith(prefix) and block.condition_text not in commands]
        return RuleAnswer.with_nudges(*nudges).running(*stale)

    def is_with_merger(self, worktree: Worktree, hook: AgentHook) -> bool:
        if not self.settings.flag(MERGER_ENABLED) or worktree.returned_at is not None:
            return False
        if worktree.merge_ready_at is None:
            return True
        return not Interval(self.settings.minutes(MERGER_WAIT_MINUTES)).has_passed(self.spans, hook.agent_id, worktree.merge_ready_at, hook.timestamp)

    def delivered_reminder_count(self, agent_id: int, key: str) -> int:
        record = self.records.newest_row(agent_id, key)
        return record.delivery_count if record is not None else 0

    def task_names(self, worker_id: int) -> str:
        return ", ".join(f"task:{task.id}" for task in self.tasks.filter(delegated_to=worker_id).unclosed().oldest().all_rows())
