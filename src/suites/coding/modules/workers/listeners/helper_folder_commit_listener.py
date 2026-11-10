from engine.event.changed import Changed
from engine.event.logged_event import LoggedEvent
from engine.listener.commit_listener import CommitListener
from engine.scope.actor_scope import ActorScope
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.profiles.support.profile_files import ProfileFiles
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class HelperFolderCommitListener(CommitListener[Changed[HelperJob]]):
    """Commits the folders a helper's profile lets it write when the helper ends its job."""

    name = "workers.helper-folder-commit"
    disabled_scopes = [ActorScope]

    def __init__(self, agents: AgentRows, folders: AgentFolders, profiles: ProfileFiles, git: WorktreeGit) -> None:
        self.agents, self.folders, self.profiles, self.git = agents, folders, profiles, git

    def handle(self, event: Changed[HelperJob], logged: LoggedEvent) -> None:
        job = event.row
        if job.ended_at is None or (event.old_row is not None and event.old_row.ended_at is not None) or job.helper_id is None:
            return
        writable = self.profiles.effective(job.profile).writable_folders
        if writable:
            folder = str(self.folders.checkout_folder(self.agents.find(job.helper_id)))
            self.git.commit_folders(folder, writable, f"{job.profile} {job.helper_id}: saved {', '.join(writable)}")
