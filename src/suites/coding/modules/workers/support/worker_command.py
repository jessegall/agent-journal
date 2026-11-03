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
from core.base.refusal import Refusal

ENVIRONMENT_VARIABLE = "JOURNAL_ENV"
ACTIVE_VARIABLE = "AGENT_JOURNAL_ACTIVE"
WORK_STEPS = ("Prove each point with journal proof make, then journal worker next while tasks are queued, and journal worker deliver after the last. "
              "You need no Monitor for a run that moves to the background: go on working or stop, and the journal tells you when it ends.")


class WorkerCommand:
    """The command line that starts a worker's program on its task, or resumes it on a new job, as its
    provider writes it."""

    def __init__(self, providers: Providers) -> None:
        self.providers = providers

    def command(self, worker: Agent, worktree: Worktree, environment: Environment, task: Task) -> LaunchCommand:
        skills = Path(worktree.folder) / self.providers.provider(worker.program).skills_folder
        reads = "\n".join(str(skills / name / "SKILL.md") for name in
                          ("journal", "journal-etiquette", "journal-tasks", "journal-shell", "journal-workers"))
        brief = (f"You are worker {worker.id} on task {task.id}, {task.title}.\n{task.brief}\n"
                 f"Read these files before your first write:\n{reads}\n"
                 f"Run journal overview, then journal task show {task.id}. Read the architectural skills required by the files you change in {skills}.\n"
                 f"Run only tests of the code you change, never the whole test suite.\n"
                 f"Decide what you can yourself. A question goes in your report to the main agent, never to the user.\n{WORK_STEPS}")
        return self.launched(worker, worktree, environment, SessionStart(worker.session), brief)

    def resumed(self, worker: Agent, worktree: Worktree, environment: Environment, job: str) -> LaunchCommand:
        return self.launched(worker, worktree, environment, ResumedSession(worker.session), f"{job}\n{WORK_STEPS}")

    def launched(self, worker: Agent, worktree: Worktree, environment: Environment, session: SessionStart, brief: str) -> LaunchCommand:
        if not worker.program_model.strip():
            raise Refusal(f"worker {worker.id} has no recorded model", "dispatch a worker with --model <model>")
        provider = self.providers.provider(worker.program)
        launch = HelperLaunch(root=Path(environment.folder), folder=Path(worktree.folder), model=worker.program_model, launch="", session=session,
                              variables={ENVIRONMENT_VARIABLE: environment.name, ACTIVE_VARIABLE: "1"}, brief=brief)
        return provider.helper_command(launch)
