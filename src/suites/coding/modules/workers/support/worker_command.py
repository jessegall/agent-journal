from pathlib import Path

from core.base.agent_type_book import AgentTypeBook
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.providers import Providers
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.helpers.support.helper_command import HelperCommand
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.tasks.models.task import Task
from core.modules.mcp.support.server_configs import ServerConfigs
from suites.coding.modules.workers.support.library_folders import LibraryFolders
from suites.coding.modules.workers.models.worktree import Worktree
from core.base.refusal import Refusal

WORK_STEPS = "Read the test suite and choose which existing tests and test files cover your changes, along with your new tests, for each proof's --test command. Prove each point with journal proof make, then journal worker next while tasks are queued, and journal worker deliver after the last."


class WorkerCommand:
    """Builds fresh and resumed worker launch commands through their providers."""

    def __init__(self, providers: Providers, servers: ServerConfigs, libraries: LibraryFolders, helpers: HelperCommand, profiles: ProfileFiles, types: AgentTypeBook) -> None:
        self.providers, self.servers, self.libraries, self.helpers = providers, servers, libraries, helpers
        self.profiles, self.types = profiles, types

    def command(self, worker: Agent, worktree: Worktree, environment: Environment, task: Task) -> LaunchCommand:
        return self.restarted(worker, worktree, environment, task, "")

    def restarted(self, worker: Agent, worktree: Worktree, environment: Environment, task: Task, job: str) -> LaunchCommand:
        provider = self.providers.provider(worker.program)
        skills = Path(worktree.folder) / provider.skills_folder
        reads = "\n".join(provider.skill_instruction(name, skills / name / "SKILL.md") for name in
                          ("journal", "journal-etiquette", "journal-tasks", "journal-shell", "journal-workers"))
        profile = self.profiles.effective(worker.profile or self.types.find(worker.role).default_profile)
        brief = (f"You are worker {worker.id}.\n{profile.body}\n\nYour task is {task.id}, {task.title}.\n{task.brief}\n{job}\n"
                 f"Load these skills before your first write:\n{reads}\n"
                 f"Run journal overview, then journal task overview {worktree.task_id} before changing project files. Load the architectural skills required by the files you change in {skills}.\n"
                 f"Run only tests of the code you change, never the whole test suite.\n"
                 f"Decide what you can yourself. A question goes in your report to the main agent, never to the user.\n{WORK_STEPS}")
        return self.launched(worker, worktree, environment, SessionStart(worker.session), brief)

    def resumed(self, worker: Agent, worktree: Worktree, environment: Environment, job: str) -> LaunchCommand:
        return self.launched(worker, worktree, environment, ResumedSession(worker.session),
                             f"{job}\nRead journal task overview {worktree.task_id} before changing project files.\n{WORK_STEPS}")

    def compacting(self, worker: Agent, worktree: Worktree, environment: Environment, line: str) -> LaunchCommand:
        return self.launched(worker, worktree, environment, ResumedSession(worker.session), line)

    def launched(self, worker: Agent, worktree: Worktree, environment: Environment, session: SessionStart, brief: str) -> LaunchCommand:
        if not worker.program_model.strip():
            raise Refusal(f"worker {worker.id} has no recorded model", "dispatch a worker with --model <model>")
        files = self.servers.write_folder(Path(worktree.folder))
        self.libraries.exclude(worktree.folder, [str(path) for path in files])
        return self.helpers.launched(worker, session, brief)
