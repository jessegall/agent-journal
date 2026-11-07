from core.base.change.changed import Changed
from core.base.change.logged_event import LoggedEvent
from core.base.listener.commit_listener import CommitListener
from core.base.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.profiles.support.profile_files import ProfileFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class HelperWrittenPathsListener(CommitListener[Changed[HelperJob]]):
    """When a helper whose profile may write folders ends its job, what it wrote in those folders is committed."""

    name = "workers.helper-written-paths"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, folders: AgentFolders, profiles: ProfileFiles, git: WorktreeGit) -> None:
        self.agents, self.folders, self.profiles, self.git = agents, folders, profiles, git

    def handle(self, event: Changed[HelperJob], logged: LoggedEvent) -> None:
        job = event.row
        if job.ended_at is None or (event.old_row is not None and event.old_row.ended_at is not None) or job.helper_id is None:
            return
        paths = self.profiles.effective(job.profile).write_paths
        if paths:
            folder = str(self.folders.folder(self.agents.find(job.helper_id)))
            self.git.commit_paths(folder, paths, f"{job.profile} {job.helper_id}: saved {', '.join(paths)}")
