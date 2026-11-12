from pathlib import PurePosixPath

from core.modules.agents.models.agent import Agent
from suites.coding.modules.workers.models.behind_facts import BehindFacts
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class BehindFactsReader:
    """Reads the facts of a worktree behind its base branch, changing nothing: the files the new base commits and
    the worker both changed are the overlap; the other base files in the folders of the worker's files are listed
    apart and never counted as overlap."""

    def __init__(self, git: WorktreeGit) -> None:
        self.git = git

    def read(self, worktree: Worktree, worker: Agent) -> BehindFacts:
        commits = self.git.base_changes(worktree)
        worker_files = self.git.worker_files(worktree)
        base_files = tuple(dict.fromkeys(name for commit in commits for name in commit.files))
        overlap = tuple(name for name in base_files if name in worker_files)
        folders = {str(PurePosixPath(name).parent) for name in worker_files}
        same_folder = tuple(name for name in base_files if name not in overlap and str(PurePosixPath(name).parent) in folders)
        uncommitted = bool(self.git.uncommitted_files(worktree.folder))
        return BehindFacts(worktree.base_branch, self.git.behind(worktree), commits, worker_files, overlap, same_folder, self.git.overlap_lines(worktree, overlap),
                           uncommitted, worker.program, worker.program_model)
