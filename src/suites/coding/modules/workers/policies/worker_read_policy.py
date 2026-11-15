from engine.driver.agent_message import AgentMessage
from engine.driver.hook_event import HookEvent
from engine.agent_machine.contracts.event_policy import EventPolicy
from suites.coding.modules.workers.types.worker import Worker
from os.path import join, normpath
from pathlib import Path

from engine.provider.providers import Providers
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.nudges.worker_read_refusal_message import WorkerReadRefusalMessage

SHARED_FOLDERS = ("/tmp", "/private/tmp")


class WorkerReadPolicy(EventPolicy):
    """A worker reads only its own worktree, the temporary folder and its program's home, never another worker's
    worktree beside its own. The OS sandbox holds its shell lines to the same limit."""

    key = "workers.worker-read"
    rank = "access.all"
    agent_types = [Worker.key]

    def __init__(self, worktrees: WorktreeQuery, providers: Providers) -> None:
        self.worktrees, self.providers = worktrees, providers

    def refusal(self, event: HookEvent, agent_id: int) -> AgentMessage | None:
        tool = event.tool
        if tool is None or not tool.category.reads_files:
            return None
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is None:
            return None
        readable = (worktree.folder, *SHARED_FOLDERS, *self.providers.provider(event.program).readable_folders())
        # the folder beside the worktree holds the other workers' worktrees, never readable, even inside a shared folder
        others = Path(worktree.folder).parent
        paths = [Path(normpath(join(worktree.folder, path))) for path in tool.files]
        if all(any(path.is_relative_to(folder) for folder in readable) and not (path.is_relative_to(others) and not path.is_relative_to(worktree.folder)) for path in paths):
            return None
        return WorkerReadRefusalMessage.declared().nudge()
