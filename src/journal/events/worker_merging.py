from dataclasses import dataclass

from journal.events.worker_merge_event import WorkerMergeEvent


@dataclass(frozen=True, kw_only=True)
class WorkerMerging(WorkerMergeEvent):
    """A worker's checked branch is about to be merged, with the inner repositories it has worktrees of and the files it changed; a plugin that holds it refuses the merge with its reason."""

    repositories: tuple[str, ...]
    files: tuple[str, ...]
