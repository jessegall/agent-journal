from pathlib import Path

from journal.config import Config
from journal.events.agent.tool_starting import ToolStarting
from journal.events.agent_listener import AgentListener
from journal.features.workers.support.worker_branch import WorkerBranch
from journal.providers.providers import Providers
from journal.repositories.workers import Workers
from journal.support.decision import Decision


class KeepOutOfWorkerWorktrees(AgentListener[ToolStarting]):
    """A write the agent makes inside a worker's worktree is refused: that worktree is the worker's, and its work comes back through the worker and its merge."""

    blocking = True

    def __init__(self, config: Config, providers: Providers, workers: Workers, branch: WorkerBranch) -> None:
        self.config, self.providers, self.workers, self.branch = config, providers, workers, branch

    def handle(self, event: ToolStarting) -> Decision | None:
        from journal.features.workers.feature import Workers as Feature
        if event.subagent or not event.writes:
            return None
        root = (self.config.home / "worktrees").resolve()
        written = [Path(p).expanduser().resolve() for p in self.providers.named(event.provider).written_paths(event.tool, event.input)]
        inside = [p for p in written if p.is_relative_to(root)]
        if not inside:
            return None
        folder = inside[0].relative_to(root).parts[0]
        owner = next((w for w in self.workers.in_() if self.branch.folder(w).name == folder), None)
        if owner is None:
            return None
        return Decision.refuse(Feature.FILE_IS_THE_WORKERS.create(n=owner.id, name=owner.name).rendered())
