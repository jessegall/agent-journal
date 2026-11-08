import json

from core.base.actor import Actor
from core.base.clock import Clock
from core.base.command.bus import Bus
from core.base.container import Container
from core.modules.agents.models.agent import Agent
from core.base.query.queries import Queries
from suites.coding.modules.workers.commands.record_worktree_libraries.record_worktree_libraries import RecordWorktreeLibraries
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.library_folders import LibraryFolders

STOPPED_SECONDS = 15 * 60


class StoppedWorkerLibraries:
    """Removes the library folders a worktree copied in once its worker has been stopped for 15 minutes: the
    source and the worker's changes stay, and a send to the worker copies the libraries back. Linked libraries
    cost nothing and stay."""

    def __call__(self, container: Container) -> bool:
        stamp = container.get(Clock).timestamp()
        queries, libraries, bus = container.get(Queries), container.get(LibraryFolders), container.get(Bus)
        worktrees = container.get(WorktreeQuery).open_worktrees()
        workers = {worker.id: worker for worker in queries.query(Agent).find_many(list(dict.fromkeys(row.session_agent_id for row in worktrees)))}
        dropped = False
        for worktree in worktrees:
            copies = json.loads(worktree.library_copies)
            worker = workers[worktree.session_agent_id]
            if not copies or worktree.libraries_dropped_at is not None or worker.ended_at is None or worker.ended_at.elapsed_seconds(stamp) < STOPPED_SECONDS:
                continue
            libraries.drop(worktree.folder, copies)
            bus.run(RecordWorktreeLibraries(worktree.id, True), Actor.core(), environment_id=worktree.environment_id)
            dropped = True
        return dropped
