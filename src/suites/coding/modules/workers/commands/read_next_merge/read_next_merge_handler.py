from dataclasses import replace

from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.driver.nudge import Nudge
from core.base.driver.nudge_type import NudgeType
from core.base.driver.nudge_declaration import NudgeDeclaration
from core.base.query.queries import Queries
from core.base.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.base.query.conditions.is_null import IsNull
from suites.coding.modules.workers.models.enums.worktree_state import WorktreeState
from suites.coding.modules.workers.models.lifecycles.worktree_lifecycle import WorktreeLifecycle
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merger_nudges import MERGER_JOB, MERGER_MERGED, MERGER_PASSED, MERGER_PROFILE, MERGER_SOURCE, NO_WORKER_WAITING
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge import ReadNextMerge
from suites.coding.modules.workers.commands.merger.require_merger import require_merger


class ReadNextMergeHandler(Handler[ReadNextMerge, str]):
    """Prints the next worker waiting and marks its logs read."""

    command = ReadNextMerge

    def __init__(self, agents: AgentRows, queries: Queries, worktrees: WorktreeQuery, log_lines: WorkerLogLines, repository: Repository) -> None:
        self.agents, self.queries, self.worktrees, self.log_lines, self.repository = agents, queries, worktrees, log_lines, repository

    def handle(self, command: ReadNextMerge, context: Context) -> str:
        require_merger(self.agents, context)
        lines = tuple(self.queries.query(MergerLine).matching(IsNull("read_at")).oldest().all_rows())
        for line in lines:
            self.repository.save_change(line, replace(line, read_at=context.timestamp), context)
        nudges = [Nudge(line.fallback_source, NudgeType.NOTICE, line.text) if line.nudge_json is None else NudgeDeclaration.restore(line.nudge_json) for line in lines]
        messages = "\n".join(f"line: {nudge.text}" for nudge in Nudge.collapsed(nudges))
        worktree = next((row for row in self.worktrees.open_worktrees() if self.waits(row)), None)
        if worktree is None:
            return messages or NO_WORKER_WAITING
        worker_id = worktree.session_agent_id
        review = self.log_lines.review(worktree)
        sections = [self.task_section(task, review.summary(task), [proof for proof in review.proofs if proof.task_id == task.id]) for task in review.tasks]
        self.repository.save_change(worktree, worktree.moved(WorktreeLifecycle.review_logs, logs_read_at=context.timestamp), context)
        important = "important lines: pass this worker to the main agent\n" if review.has_important_lines() else ""
        return f"{messages}\nworker {worker_id}\n{important}\n" + "\n\n".join(sections)

    @staticmethod
    def waits(worktree: Worktree) -> bool:
        return worktree.state is WorktreeState.DELIVERED and worktree.tests_passed_at is not None and worktree.left_to_main_at is None

    @staticmethod
    def task_section(task, summary: str, proofs: list[Proof]) -> str:
        proof_lines = "\n".join(f"proof {proof.id}, point {proof.point}, {proof.state}: {proof.text}" for proof in proofs)
        return f"{summary}\nbrief: {task.brief}\n{proof_lines}"
