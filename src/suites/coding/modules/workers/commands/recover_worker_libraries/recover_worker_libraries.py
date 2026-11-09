from dataclasses import dataclass

from core.base.command.command import Command


@dataclass(frozen=True)
class RecoverWorkerLibraries(Command[str]):
    """Puts back the library folders missing from a worker's worktree."""

    worker_id: int
