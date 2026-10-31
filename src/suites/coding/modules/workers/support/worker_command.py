from pathlib import Path

from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.model_tier import ModelTier
from core.base.provider.providers import Providers
from core.base.provider.session_start import SessionStart
from core.modules.agents.models.agent import Agent
from core.modules.environments.models.environment import Environment
from core.modules.tasks.models.task import Task
from suites.coding.modules.workers.models.worktree import Worktree

ENVIRONMENT_VARIABLE = "JOURNAL_ENV"
ACTIVE_VARIABLE = "AGENT_JOURNAL_ACTIVE"


class WorkerCommand:
    """The command line that starts a worker's program on its task, as its provider writes it."""

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def command(self, worker: Agent, worktree: Worktree, environment: Environment, task: Task) -> LaunchCommand:
        provider = self.providers.provider(worker.program)
        model = next(model.name for model in provider.models if model.tier is ModelTier.GENERAL)
        brief = f"You are worker {worker.id} on task {task.id}, {task.title}.\n{task.brief}\nProve each point with journal proof make, then journal worker deliver."
        launch = HelperLaunch(root=Path(environment.folder), folder=Path(worktree.folder), model=model, launch="", session=SessionStart(worker.session),
                              variables={ENVIRONMENT_VARIABLE: environment.name, ACTIVE_VARIABLE: "1"}, brief=brief)
        return provider.helper_command(launch)
