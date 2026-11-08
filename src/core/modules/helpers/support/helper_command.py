from pathlib import Path

from core.base.provider.helper_launch import HelperLaunch
from core.base.provider.launch_command import LaunchCommand
from core.base.provider.providers import Providers
from core.base.provider.resumed_session import ResumedSession
from core.base.provider.session_start import SessionStart
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.environments.support.environment_rows import EnvironmentRows
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_start_folder import HelperStartFolder
from core.modules.profiles.support.profile_files import ProfileFiles

ENVIRONMENT_VARIABLE = "JOURNAL_ENV"
ACTIVE_VARIABLE = "AGENT_JOURNAL_ACTIVE"
BLANK_LINE = "\n\n"
REPORT_STEP = "When the job is done, stop with your report as your last words. A long report goes in a document: journal doc make with --body."


class HelperCommand:
    """The command line that starts an agent's program on its job, as its provider writes it, in its folder."""

    def __init__(self, providers: Providers, folders: AgentFolders, profiles: ProfileFiles, environments: EnvironmentRows, start_folders: HelperStartFolder, programs: HelperPrograms) -> None:
        self.providers, self.folders, self.profiles, self.environments = providers, folders, profiles, environments
        self.start_folders, self.programs = start_folders, programs

    def command(self, helper: Agent, job: HelperJob) -> LaunchCommand:
        return self.restarted(helper, job.brief)

    def restarted(self, helper: Agent, job: str) -> LaunchCommand:
        self.start_folders.prepare(helper)
        if self.folders.start_folder(helper).is_dir():
            self.programs.checked(helper.program, self.folders.folder(helper))
        profile = self.profiles.effective(helper.profile)
        return self.launched(helper, SessionStart(helper.session), BLANK_LINE.join((f"You are helper {helper.id}.", profile.body, job, REPORT_STEP)))

    def resumed(self, helper: Agent, job: str) -> LaunchCommand:
        if self.folders.start_folder(helper).is_dir():
            self.start_folders.prepare(helper)
        return self.launched(helper, ResumedSession(helper.session), BLANK_LINE.join((job, REPORT_STEP)))

    def launched(self, agent: Agent, session: SessionStart, brief: str) -> LaunchCommand:
        environment = self.environments.find(agent.environment_id)
        launch = HelperLaunch(root=Path(environment.folder), folder=self.folders.folder(agent), model=agent.program_model, launch="", session=session,
                              variables={ENVIRONMENT_VARIABLE: environment.name, ACTIVE_VARIABLE: "1"}, brief=brief)
        return self.providers.provider(agent.program).helper_command(launch)
