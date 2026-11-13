from dataclasses import dataclass

from suites.coding.modules.workers.support.base_commit import BaseCommit


@dataclass(frozen=True)
class BehindFacts:
    """What one look at a worktree that fell behind its base branch reads: how far behind, the new base
    commits, the worker's own files, the files both changed, the other base files in the worker's folders, how
    many lines the base changed in the shared files, whether the worker has uncommitted work, its program and
    model, the earlier decisions about it, and the base tip it was read at."""

    base_branch: str
    commits_lagging: int
    commits: tuple[BaseCommit, ...]
    worker_files: tuple[str, ...]
    overlap: tuple[str, ...]
    shared_folder: tuple[str, ...]
    overlap_lines: int
    has_uncommitted: bool
    program: str
    model: str
    prior_decisions: tuple[str, ...] = ()
    base_tip: str = ""

    def lines(self) -> list[str]:
        return [f"{self.commits_lagging} behind {self.base_branch}",
                *(f"  {commit.short_id} {commit.subject}: {', '.join(commit.files) or 'no files'}" for commit in self.commits),
                f"Worker files: {', '.join(self.worker_files) or 'none'}",
                f"Overlap: {', '.join(self.overlap) or 'none'} ({self.overlap_lines} lines changed on the base)",
                f"Same folder, not overlap: {', '.join(self.shared_folder) or 'none'}",
                f"Uncommitted work: {'yes' if self.has_uncommitted else 'no'}",
                f"Program: {self.program} {self.model}".rstrip(),
                *(f"Earlier: {decision}" for decision in self.prior_decisions)]
