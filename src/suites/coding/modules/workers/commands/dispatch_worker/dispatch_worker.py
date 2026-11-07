from dataclasses import dataclass

from core.base.provider.model_tier import ModelTier

from core.base.command.command import Command
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch


@dataclass(frozen=True)
class DispatchWorker(Command[WorkerLaunch]):
    """Starts a worker on an open task, in a worktree cut from the environment's branch, running the
    program named or else the dispatching agent's own, on the model named; more tasks may be delegated
    to it, which it takes after the first. Its profile and given name show on its card. A person may give it the
    session of a program that is not started, so the hooks of that session are the worker's."""

    lock = False

    task_id: int
    library_links: tuple[str, ...] = ()
    library_copies: tuple[str, ...] = ()
    program: str = ""
    delegated_ids: tuple[int, ...] = ()
    program_model: str = ""
    profile: str = ""
    given_name: str = ""
    new_agent_reason: str = ""
    tier: ModelTier | None = None
    plan_id: int | None = None
    phase_id: int | None = None
    session: str = ""
    starts_program: bool = True
    sandboxed: bool = True
