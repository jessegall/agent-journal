from pathlib import Path

from core.base.change.file_publishing import FilePublishing
from core.base.change.logged_event import LoggedEvent
from core.base.journal_home import JournalHome
from core.base.listener.commit_listener import CommitListener
from core.modules.environments.support.environment_rows import EnvironmentRows
from suites.coding.modules.workers.support.worktree_git import WorktreeGit

PUBLISHED_FOLDERS = (".claude/agents", ".codex/agents", ".agents/profiles", ".claude/skills", ".agents/skills")


class PublishedFilesCommitListener(CommitListener[FilePublishing]):
    """Commits the profile and skill copies the journal writes into the project, once it has written them, when the
    project folder is a git work tree on its environment's branch, so a merge never meets them as uncommitted work."""

    name = "workers.published-files-commit"
    run_order = 10

    def __init__(self, home: JournalHome, environments: EnvironmentRows, git: WorktreeGit) -> None:
        self.home, self.environments, self.git = home, environments, git

    def handle(self, event: FilePublishing, logged: LoggedEvent) -> None:
        folder = self.home.project_folder
        environment = next((row for row in self.environments.all() if Path(row.folder).resolve() == folder.resolve()), None)
        if environment is None or not self.git.is_on_branch(str(folder), environment.branch):
            return
        names = self.git.changed_names(str(folder), PUBLISHED_FOLDERS)
        if names:
            self.git.commit_folders(str(folder), PUBLISHED_FOLDERS, f"Journal publishes {', '.join(names)}")
