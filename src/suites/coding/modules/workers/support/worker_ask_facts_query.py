from core.base.query.queries import Queries
from core.modules.processes.queries.process_query import ProcessQuery
from suites.coding.modules.workers.models.worker_refusal_count import WorkerRefusalCount
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worker_ask_facts import WorkerAskFacts
from suites.coding.modules.workers.support.worker_guidance import WorkerGuidance
from suites.coding.modules.workers.support.worker_point import WorkerPoint
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

OUTPUT_COUNT = 3


class WorkerAskFactsQuery:
    """Reads the facts of a worker that asks the merger something."""

    def __init__(self, guidance: WorkerGuidance, processes: ProcessQuery, queries: Queries, git: WorktreeGit) -> None:
        self.guidance, self.processes, self.queries, self.git = guidance, processes, queries, git

    def read(self, point: WorkerPoint) -> WorkerAskFacts:
        worker_round = point.round
        task = self.guidance.current_task(worker_round)
        outputs = tuple(f"output {process.id}, {process.state}: {process.line}" for process in self.processes.agent(worker_round.worker_id).newest().limited(OUTPUT_COUNT))
        worktree = worker_round.worktree
        if worktree is None:
            return WorkerAskFacts(point.step.value, task.id, None, outputs, ())
        return WorkerAskFacts(point.step.value, task.id, self.last_refusal(worktree), outputs, tuple(sorted(self.git.worker_files(worktree))))

    def last_refusal(self, worktree: Worktree) -> str | None:
        counted = self.queries.query(WorkerRefusalCount).filter(worktree_id=worktree.id).first()
        return None if counted is None else counted.refusal_text
