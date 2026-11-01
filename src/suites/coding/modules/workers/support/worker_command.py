from pathlib import Path

from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.providers import Providers
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree
from suites.coding.modules.workers.support.allowed_models import AllowedModels

ENVIRONMENT_VARIABLE = "JOURNAL_ENV"
ACTIVE_VARIABLE = "AGENT_JOURNAL_ACTIVE"


class WorkerCommand:
    """The command line that starts a worker's program on its task, or resumes it on a new job, as its provider writes it."""

    def __init__(self, providers: Providers, models: AllowedModels) -> None:
        self.providers, self.models = providers, models

    def command(self, worker: Agent, worktree: Worktree, environment: Environment, task: Task) -> LaunchCommand:
        brief = f"You are worker {worker.id} on task {task.id}, {task.title}.\n{task.brief}\nProve each point with journal proof make, then journal worker deliver."
        return self.launched(worker, worktree, environment, SessionStart(worker.session), brief)

    def resumed(self, worker: Agent, worktree: Worktree, environment: Environment, job: str) -> LaunchCommand:
        return self.launched(worker, worktree, environment, ResumedSession(worker.session), f"{job}\nProve each point with journal proof make, then journal worker deliver.")

    def launched(self, worker: Agent, worktree: Worktree, environment: Environment, session: SessionStart, brief: str) -> LaunchCommand:
        provider = self.providers.provider(worker.program)
        launch = HelperLaunch(root=Path(environment.folder), folder=Path(worktree.folder), model=self.models.worker_model(provider, environment.id), launch="", session=session,
                              variables={ENVIRONMENT_VARIABLE: environment.name, ACTIVE_VARIABLE: "1"}, brief=brief)
        return provider.helper_command(launch)
