from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.database.kept_rows import KeptRows
from core.base.query.queries import Queries
from core.modules.skills.support.skill_projects import SkillProjects
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerSkillProjects(SkillProjects):
    """Include Git worktrees when publishing skills and select a worker's own folder for reminders."""

    def __init__(self, home: JournalHome, queries: Queries, worktrees: WorktreeQuery, git: WorktreeGit, kept: KeptRows) -> None:
        super().__init__(home, queries, kept)
        self.worktrees, self.git = worktrees, git

    def projects(self) -> tuple[Path, ...]:
        projects = super().projects()
        worktrees = (Path(folder) for project in projects if (project / ".git").exists() for folder, _ in self.git.folders(str(project)) if Path(folder).is_dir())
        return tuple(dict.fromkeys((*projects, *worktrees)))

    def agent_folder(self, agent_id: int, environment_id: int) -> Path:
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is not None:
            return Path(worktree.folder)
        return super().agent_folder(agent_id, environment_id)
