from uuid import uuid4

from core.base.command.bus import Bus
from core.base.command.context import Context
from core.base.command.handler import Handler
from core.base.refusal import Refusal
from core.base.repository.repository import Repository
from core.base.agent_type_book import AgentTypeBook
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.agents.support.launcher_link import LauncherLink
from core.base.profile.agent_profile import AgentProfile
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_reuse import HelperReuse
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.profiles.commands.count_profile_use.count_profile_use import CountProfileUse
from core.modules.profiles.support.profile_files import ProfileFiles

BRIEF_LIMIT_CHARACTERS = 100000
SHORT_BRIEF_CHARACTERS = 200


class StartHelperHandler(Handler[StartHelper, Agent]):
    """Starts a helper of a profile as a process the journal owns, in the folder of the agent that asked."""

    command = StartHelper

    def __init__(self, profiles: ProfileFiles, types: AgentTypeBook, limits: HelperLimits, launcher: LauncherLink, bus: Bus, repository: Repository, reuse: HelperReuse, programs: HelperPrograms, folders: AgentFolders) -> None:
        self.profiles, self.types, self.limits, self.launcher, self.bus, self.repository, self.reuse = profiles, types, limits, launcher, bus, repository, reuse
        self.programs, self.folders = programs, folders

    def handle(self, command: StartHelper, context: Context) -> Agent:
        if len(command.brief) > BRIEF_LIMIT_CHARACTERS:
            raise Refusal(f"a brief is at most {BRIEF_LIMIT_CHARACTERS} characters", "put the text in journal doc make and name the document in the brief")
        profile = self.profiles.effective(command.profile)
        agent_type = self.types.find(profile.agent_type)
        if agent_type.start_line:
            raise Refusal(f"{profile.name} is a {agent_type.label}: use {agent_type.start_line}")
        if not self.launcher.is_running:
            raise Refusal("a helper needs the launcher, which is not running", "keep your work and start the journal with journal launch")
        parent = self.limits.checked_parent(context)
        self.limits.checked_slot(parent.environment_id)
        if not command.new_helper and not profile.independent:
            self.check_reuse(parent, profile, command.brief)
        program = command.program or profile.program or parent.program
        model = self.limits.checked_model(program, command.program_model or profile.program_model(program))
        self.programs.checked(program, self.folders.folder(parent))
        start = StartAgent(str(uuid4()), program, agent_type.key, parent.id, program_model=model, profile=profile.name, given_name=command.given_name, access=profile.access or agent_type.access)
        helper = self.bus.dispatch(start, context)
        self.repository.save(HelperJob(session_agent_id=parent.id, creator_id=context.actor.id, tool_key=helper.session, helper_id=helper.id, profile=profile.name, program_model=model,
                                       description=command.given_name or profile.name, brief=command.brief, instruction=command.brief[:SHORT_BRIEF_CHARACTERS]), context)
        self.bus.dispatch(CountProfileUse(profile.name), context)
        return helper

    def check_reuse(self, parent: Agent, profile: AgentProfile, brief: str) -> None:
        job = self.reuse.known_job(parent.id, profile.name, brief)
        if job is not None:
            raise Refusal(f"agent:{job.helper_id} knows these files", f"journal helper send {job.helper_id} \"<job>\", or start a new one with --fresh")
