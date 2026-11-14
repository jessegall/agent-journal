from dataclasses import replace

from engine.command.context import Context
from engine.command.handler import Handler
from engine.driver.nudge import Nudge
from engine.enums.nudge_type import NudgeType
from engine.driver.nudge_declaration import NudgeDeclaration
from engine.query.queries import Queries
from engine.repository.repository import Repository
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.merger_line import MergerLine
from suites.coding.modules.workers.models.merger_visit import MergerVisit
from suites.coding.modules.workers.models.proof import Proof
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.merger_nudges import NO_WORKER_WAITING
from suites.coding.modules.workers.support.worker_log_lines import WorkerLogLines
from suites.coding.modules.workers.support.merge_ask_section import MergeAskSection
from suites.coding.modules.workers.support.merger_work import MergerWork
from suites.coding.modules.workers.support.worker_log_read import WorkerLogRead
from suites.coding.modules.workers.commands.read_next_merge.read_next_merge import ReadNextMerge
from suites.coding.modules.workers.commands.merger.require_merger import require_merger
from suites.coding.modules.workers.support.oversight import Oversight
from core.modules.agents.support.agent_label import AgentLabel
from engine.cli.row_numbers import RowNumbers


class ReadNextMergeHandler(Handler[ReadNextMerge, str]):
    """Prints the next worker waiting and marks its logs read."""

    command = ReadNextMerge

    def __init__(self, agents: AgentRows, queries: Queries, worktrees: WorktreeQuery, log_lines: WorkerLogLines, repository: Repository, log_read: WorkerLogRead, numbers: RowNumbers,
                 merge_request: MergeAskSection, work: MergerWork, oversight: Oversight) -> None:
        self.merge_ask, self.work, self.oversight = merge_request, work, oversight
        self.numbers = numbers
        self.agents, self.queries, self.worktrees, self.log_lines, self.repository, self.log_read = agents, queries, worktrees, log_lines, repository, log_read

    def handle(self, command: ReadNextMerge, context: Context) -> str:
        if context.actor.is_agent() and self.oversight.is_overseer(self.agents.find(context.actor.id)):
            return self.waiting_text(self.work.unread_lines())
        require_merger(self.agents, context)
        visit = self.repository.save(MergerVisit(), context)
        lines = self.work.unread_lines()
        text = self.waiting_text(lines)
        output_id = self.record_lines(lines, text, command, visit, context)
        worktree = self.work.next_worktree()
        if worktree is not None:
            self.log_read.record(worktree, output_id, context)
        return text

    # The lines to the merger and the next worker waiting with its tasks, or that no worker waits.
    def waiting_text(self, lines: tuple[MergerLine, ...]) -> str:
        nudges = [Nudge(line.fallback_source, NudgeType.NOTICE, line.text) if line.nudge_json is None else NudgeDeclaration.restore(line.nudge_json) for line in lines]
        messages = "\n".join(f"line: {nudge.text}" for nudge in Nudge.collapsed(nudges))
        worktree = self.work.next_worktree()
        if worktree is None:
            return messages or NO_WORKER_WAITING
        review = self.log_lines.review(worktree)
        sections = [self.task_section(task, review.summary(task), [proof for proof in review.proofs if proof.task_id == task.id]) for task in review.tasks]
        important = "important lines: pass this worker to the main agent\n" if review.has_important_lines() else ""
        return f"{messages}\n{AgentLabel.labelled_row(worktree.session_agent_id, self.numbers, "worker").text}\n{important}{self.merge_ask.text(worktree)}\n" + "\n\n".join(sections)

    def record_lines(self, lines: tuple[MergerLine, ...], text: str, command: ReadNextMerge, visit: MergerVisit, context: Context) -> int | None:
        output_id = self.log_read.pending_output(text, command.process_id, command.json_output, context)
        read_at = context.timestamp if output_id is None else None
        for line in lines:
            self.repository.save_change(line, replace(line, read_at=read_at, read_output_id=output_id, visit_id=visit.id, visit_count=line.visit_count + 1), context)
        return output_id

    @staticmethod
    def task_section(task: Task, summary: str, proofs: list[Proof]) -> str:
        proof_lines = "\n".join(f"proof {proof.id}, point {proof.point}, {proof.state}: {proof.text}" for proof in proofs)
        return f"{summary}\nbrief: {task.brief}\n{proof_lines}"
