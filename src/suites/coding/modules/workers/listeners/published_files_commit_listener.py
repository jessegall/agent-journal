from engine.event.file_publishing import FilePublishing
from engine.event.logged_event import LoggedEvent
from engine.listener.commit.commit_listener import CommitListener
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

PUBLISHED_FOLDERS = (".claude/agents", ".codex/agents", ".agents/profiles", ".claude/skills", ".agents/skills")


class PublishedFilesCommitListener(CommitListener[FilePublishing]):
    """Commits the profile and skill copies the journal writes into each environment's checkout, once it has
    written them, when the folder is a git work tree on the environment's branch, so a merge never meets
    them as uncommitted work."""

    name = "workers.published-files-commit"
    run_order = 10

    def __init__(self, environments: EnvironmentRows, git: WorktreeGit) -> None:
        self.environments, self.git = environments, git

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        checkouts = {(environment.folder, environment.branch) for environment in self.environments.all() if not environment.test}
        for folder, branch in sorted(checkouts):
            if self.git.is_current_branch(folder, branch):
                self.commit(folder)

    def commit(self, folder: str) -> None:
        names = self.git.changed_names(folder, PUBLISHED_FOLDERS)
        if names:
            self.git.commit_folders(folder, PUBLISHED_FOLDERS, f"Journal publishes {', '.join(names)}")
