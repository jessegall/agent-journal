from pathlib import PurePosixPath

from engine.query.queries import Queries
from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.worktree_behind_check import WorktreeBehindCheck
from suites.coding.modules.workers.support.behind_facts import BehindFacts
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit
from suites.coding.modules.workers.support.behind_checks import CHECKS_REASON



class BehindFactsReader:
    """Reads the facts of a worktree behind its base branch, changing nothing: the files the new base commits
    and the worker both changed are the overlap; the other base files in the folders of the worker's files are
    listed apart and never counted as overlap."""

    def __init__(self, git: WorktreeGit, queries: Queries) -> None:
        self.git, self.queries = git, queries

    def read(self, worktree: Worktree, worker: Agent) -> BehindFacts:
        tip = self.git.tip(worktree.folder, worktree.base_branch)
        commits = self.git.base_changes(worktree, tip)
        worker_files = self.git.worker_files(worktree)
        base_files = tuple(dict.fromkeys(name for commit in commits for name in commit.files))
        overlap = tuple(name for name in base_files if name in worker_files)
        folders = {str(PurePosixPath(name).parent) for name in worker_files}
        shared_folder = tuple(name for name in base_files if name not in overlap and str(PurePosixPath(name).parent) in folders)
        uncommitted = bool(self.git.uncommitted_files(worktree.folder))
        return BehindFacts(worktree.base_branch, self.git.tip_lag_count(worktree, tip), commits, worker_files, overlap, shared_folder, self.git.overlap_lines(worktree, overlap, tip),
                           uncommitted, worker.program, worker.program_model, self.earlier_decisions(worktree), tip)

    def earlier_decisions(self, worktree: Worktree) -> tuple[str, ...]:
        checks = self.queries.query(WorktreeBehindCheck).filter(worktree_id=worktree.id).every_row(CHECKS_REASON)
        return tuple(f"{check.commits_lagging} behind, {check.state}{': ' + check.reason if check.reason else ''}" for check in checks if not check.open_for_decision())
