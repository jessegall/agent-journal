from dataclasses import dataclass

from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch


@dataclass(frozen=True)
class DispatchWorker(Command[WorkerLaunch]):
    """Starts a worker on an open task, in a worktree cut from the environment's branch, running the program
    named or else the dispatching agent's own; more tasks may be delegated to it, which it takes after the first.
    """

    task_id: int
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
    program: str = ""
    delegated_ids: tuple[int, ...] = ()
