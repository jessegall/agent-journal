from engine.driver.nudge import Nudge
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.types.worker import Worker
from pathlib import Path

from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.nudges.worker_foreign_link_nudge import WorkerForeignLinkNudge

LINK_PROGRAM = "ln"


class WorkerOutsideLinkPolicy(EventPolicy):
    """Stops a worker linking something from outside its worktree into it; the journal links the shared libraries."""

    key = "workers.outside-link"
    rank = "access.all"
    agent_types = [Worker.key]

    def __init__(self, worktrees: WorktreeQuery) -> None:
        self.worktrees = worktrees

    def refusal(self, event: HookEvent, agent_id: int) -> Nudge | None:
        tool = event.tool
        worktree = self.worktrees.worker_worktree(agent_id)
        if tool is None or tool.shell is None or worktree is None:
            return None
        arguments = [argument for part in tool.shell.parts if part.program == LINK_PROGRAM for argument in part.arguments if not argument.startswith("-")]
        if any(not Path(worktree.folder, argument).resolve().is_relative_to(Path(worktree.folder).resolve()) for argument in arguments):
            return WorkerForeignLinkNudge.declared().nudge()
        return None
