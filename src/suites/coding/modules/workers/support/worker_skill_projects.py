from pathlib import Path

from core.base.journal_home import JournalHome
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.skills.support.profile_skills import ProfileSkills
from core.modules.skills.support.skill_projects import SkillProjects
from suites.coding.modules.workers.queries.worktree_query import WorktreeQuery
from suites.coding.modules.workers.support.worktree_git import WorktreeGit


class WorkerSkillProjects(SkillProjects):
    """Include Git worktrees when publishing skills, hold a worker's worktree to the skills of its profile, and
    select a worker's own folder for reminders."""

    def __init__(self, home: JournalHome, environments: EnvironmentRows, worktrees: WorktreeQuery, git: WorktreeGit, agents: AgentRows, profiles: ProfileFiles,
                 listed: ProfileSkills) -> None:
        super().__init__(home, environments)
        self.worktrees, self.git, self.agents, self.profiles, self.listed = worktrees, git, agents, profiles, listed
        self.kept_folders: dict[Path, tuple[int, tuple[Path, ...]]] = {}

    def projects(self) -> tuple[Path, ...]:
        projects = super().projects()
        worktrees = (folder for project in projects if (project / ".git").exists() for folder in self.worktree_folders(project) if folder.is_dir())
        return tuple(dict.fromkeys((*projects, *worktrees)))

    def worktree_folders(self, project: Path) -> tuple[Path, ...]:
        listing = project / ".git" / "worktrees"
        mark = listing.stat().st_mtime_ns if listing.exists() else 0
        if project not in self.kept_folders or self.kept_folders[project][0] != mark:
            self.kept_folders[project] = (mark, tuple(Path(folder) for folder, _ in self.git.folders(str(project))))
        return self.kept_folders[project][1]

    def permits(self, project: Path, folder: str) -> bool:
        worktree = next((row for row in self.worktrees.open_worktrees() if Path(row.folder).resolve() == project), None)
        if worktree is None:
            return True
        name = self.agents.find(worktree.session_agent_id).profile
        profile = self.profiles.row(name) if self.profiles.has(name) else None
        return profile is None or isinstance(profile, ProfileProblem) or not self.listed.refuses(profile, folder)

    def agent_folder(self, agent_id: int, environment_id: int) -> Path:
        worktree = self.worktrees.worker_worktree(agent_id)
        if worktree is not None:
            return Path(worktree.folder)
        return super().agent_folder(agent_id, environment_id)
