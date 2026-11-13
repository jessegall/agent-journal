from dataclasses import dataclass

from suites.coding.modules.workers.support.worker_test_command_entry import WorkerTestCommandEntry

from engine.enums.model_tier import ModelTier

from engine.command.command import Command
from suites.coding.modules.workers.support.worker_launch import WorkerLaunch


@dataclass(frozen=True)
class DispatchWorker(Command[WorkerLaunch]):
    """Starts a worker on an open task, in a worktree cut from the environment's branch, running the
    program commands or else the dispatching agent's own, on the model commands; more tasks may be
    delegated to it, which it takes after the first. Its profile and given name show on its card. A user
    may give it the session of a program that is not started, so the hooks of that session are the
    worker's. A worker that takes another's place goes on in the stopped worker's open worktree instead."""

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
    test_commands: tuple[WorkerTestCommandEntry, ...] = ()
    taken_from: int | None = None
