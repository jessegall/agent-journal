from engine.file.file_access import FileAccess
from collections.abc import Callable
from pathlib import Path

from engine.journal.journal_home import JournalHome
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.skills.support.agent_profile_skills import AgentProfileSkills
from core.modules.skills.support.skill_projects import SkillProjects
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerSkillProjects(SkillProjects):
    """Include Git worktrees when publishing skills, hold a worker's worktree to the skills of its profile, and
    select a worker's own folder for reminders."""

    def __init__(self, home: JournalHome, environments: EnvironmentRows, worktrees: WorktreeQuery, git: WorktreeGit, skills: AgentProfileSkills) -> None:
        super().__init__(home, environments)
        self.worktrees, self.git, self.skills = worktrees, git, skills
        self.kept_folders: dict[Path, tuple[int, tuple[Path, ...]]] = {}

    def projects(self) -> tuple[Path, ...]:
        projects = super().projects()
        worktrees = (folder for project in projects if FileAccess.exists(project / ".git") for folder in self.worktree_folders(project) if FileAccess.is_dir(folder))
        return tuple(dict.fromkeys((*projects, *worktrees)))

    def worktree_folders(self, project: Path) -> tuple[Path, ...]:
        listing = project / ".git" / "worktrees"
        mark = FileAccess.stat(listing).st_mtime_ns if FileAccess.exists(listing) else 0
        if project not in self.kept_folders or self.kept_folders[project][0] != mark:
            self.kept_folders[project] = (mark, tuple(Path(folder) for folder, _ in self.git.folders(str(project))))
        return self.kept_folders[project][1]

    def permitted(self, project: Path) -> Callable[[str], bool]:
        folder = project.resolve()
        worktree = next((row for row in self.worktrees.open_worktrees() if Path(row.folder).resolve() == folder), None)
        if worktree is None:
            return super().permitted(project)
        refused = self.skills.refused(worktree.session_agent_id)
        return lambda skill_folder: not refused(skill_folder)

    def agent_folder(self, agent_id: int, environment_id: int) -> Path:
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is not None:
            return Path(worktree.folder)
        return super().agent_folder(agent_id, environment_id)
