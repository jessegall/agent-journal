import json

from engine.actor.actor import Actor
from engine.time.clock import Clock
from engine.command.bus import Bus
from engine.container.container import Container
from core.modules.agents.models.agent import Agent
from engine.query.queries import Queries
from suites.coding.modules.workers.commands.record_worktree_libraries.record_worktree_libraries import RecordWorktreeLibraries
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.library_folders import LibraryFolders

STOPPED_SECONDS = 15 * 60


class StoppedWorkerLibraries:
    """Removes the library folders a worktree linked or copied in once its worker has been stopped for 15 minutes,
    so no scan of the worktree walks them: the source and the worker's changes stay, and a send to the worker links
    and copies the libraries back."""

    def __call__(self, container: Container) -> bool:
        stamp = container.get(Clock).timestamp()
        queries, libraries, bus = container.get(Queries), container.get(LibraryFolders), container.get(Bus)
        worktrees = container.get(WorktreeQuery).open_worktrees()
        workers = {worker.id: worker for worker in queries.query(Agent).find_many(list(dict.fromkeys(row.session_agent_id for row in worktrees)))}
        dropped = False
        for worktree in worktrees:
            links, copies = json.loads(worktree.library_links), json.loads(worktree.library_copies)
            worker = workers[worktree.session_agent_id]
            if not (links or copies) or worktree.libraries_dropped_at is not None or worker.ended_at is None or worker.ended_at.elapsed_seconds(stamp) < STOPPED_SECONDS:
                continue
            libraries.drop(worktree.folder, links, copies)
            bus.run(RecordWorktreeLibraries(worktree.id, True), Actor.core(), environment_id=worktree.environment_id)
            dropped = True
        return dropped
