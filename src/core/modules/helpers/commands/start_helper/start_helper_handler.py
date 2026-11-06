from uuid import uuid4
from dataclasses import replace

from core.base.actor import Actor
from core.base.shell_sandbox import ShellSandbox
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
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.base.provider.providers import Providers
from core.modules.profiles.commands.count_profile_use.count_profile_use import CountProfileUse
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.messages.support.work_sources import WorkSources

BRIEF_LIMIT_CHARACTERS = 100000
SHORT_BRIEF_CHARACTERS = 200

INDEPENDENT_REASON = "An independent profile starts a new helper for its own view."


class StartHelperHandler(Handler[StartHelper, Agent]):
    """Starts a helper of a profile as a process the journal owns, in the folder of the agent that asked."""

    command = StartHelper

    def __init__(self, profiles: ProfileFiles, types: AgentTypeBook, limits: HelperLimits, launcher: LauncherLink, bus: Bus, repository: Repository, reuse: HelperReuse, programs: HelperPrograms, folders: AgentFolders, providers: Providers, sources: WorkSources, sandbox: ShellSandbox, kept: KeptHelpers) -> None:
        self.kept = kept
        self.sandbox = sandbox
        self.profiles, self.types, self.limits, self.launcher, self.bus, self.repository, self.reuse = profiles, types, limits, launcher, bus, repository, reuse
        self.programs, self.folders, self.providers = programs, folders, providers
        self.sources = sources

    def prepare(self, command: StartHelper, actor: Actor) -> None:
        self.sandbox.check()

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
        self.limits.checked_new_place(profile.name)
        reuses_helpers = not command.new_agent_reason.strip() and not profile.independent
        if reuses_helpers:
            self.check_reuse(parent, profile, command.brief)
        program = command.program or profile.program or parent.program
        model = self.limits.checked_model(program, command.program_model or self.providers.provider(program).profile_model(profile))
        self.programs.checked(program, self.folders.folder(parent))
        if reuses_helpers:
            self.check_idle(profile, program, model)
        start = StartAgent(str(uuid4()), program, agent_type.key, parent.id, program_model=model, profile=profile.name, given_name=command.given_name, access=profile.access or agent_type.access)
        source_context = replace(context, environment_id=parent.environment_id)
        source = self.sources.source_copy(source_context)
        helper = self.bus.dispatch(start, context)
        self.repository.save(HelperJob(session_agent_id=parent.id, creator_id=context.actor.id, tool_key=helper.session, helper_id=helper.id, profile=profile.name, program_model=model,
                                       description=command.given_name or profile.name, brief=command.brief, new_agent_reason=INDEPENDENT_REASON if profile.independent and not command.new_agent_reason.strip() else command.new_agent_reason.strip(), review_plan_id=command.review_plan_id, instruction=command.brief[:SHORT_BRIEF_CHARACTERS],
                                       source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, started_at=context.timestamp), context)
        self.sources.use_copy(source, source_context)
        self.bus.dispatch(CountProfileUse(profile.name), context)
        return helper

    def check_idle(self, profile: AgentProfile, program: str, model: str) -> None:
        idle_helpers = self.kept.idle(profile.name, program, model)
        if idle_helpers:
            next_helpers = f" (also {', '.join(str(helper.id) for helper in idle_helpers[1:3])})" if idle_helpers[1:] else ""
            raise Refusal(f'helper {idle_helpers[0].id} is idle: journal helper send {idle_helpers[0].id} "<job>"{next_helpers}', 'or --fresh "<why>"')

    def check_reuse(self, parent: Agent, profile: AgentProfile, brief: str) -> None:
        job = self.reuse.known_job(parent.id, profile.name, brief)
        if job is not None:
            raise Refusal(f"agent:{job.helper_id} knows these files", f"journal helper send {job.helper_id} \"<job>\", or start a new one with --fresh")
