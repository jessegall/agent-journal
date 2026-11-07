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
from core.base.profile.agent_profile import AgentProfile
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_reuse import HelperReuse
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.helpers.support.helper_counts import HelperCounts
from core.modules.helpers.support.program_shares import ProgramShares
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.helpers.commands.start_helper.helper_started import HelperStarted
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.profile_models import ProfileModels
from core.modules.helpers.support.helper_program import HelperProgram
from core.base.provider.model_tier import ModelTier
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.base.provider.providers import Providers
from core.modules.profiles.commands.count_profile_use.count_profile_use import CountProfileUse
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.messages.support.work_sources import WorkSources

BRIEF_LIMIT_CHARACTERS = 100000
SHORT_BRIEF_CHARACTERS = 200

INDEPENDENT_REASON = "An independent profile starts a new helper for its own view."


class StartHelperHandler(Handler[StartHelper, HelperStarted]):
    """Starts a helper of a profile as a process the journal owns, in the folder of the agent that asked. A profile
    that prefers its program only if possible starts on another program, with that program's model, when the
    preferred one cannot start, and the start says so."""

    command = StartHelper

    def __init__(self, profiles: ProfileFiles, types: AgentTypeBook, limits: HelperLimits, bus: Bus, repository: Repository, reuse: HelperReuse, programs: HelperPrograms, folders: AgentFolders, providers: Providers, sources: WorkSources, sandbox: ShellSandbox, kept: KeptHelpers, models: ProfileModels, shares: ProgramShares, states: ProgramStates, counts: HelperCounts) -> None:
        self.kept, self.models = kept, models
        self.sandbox = sandbox
        self.profiles, self.types, self.limits, self.bus, self.repository, self.reuse = profiles, types, limits, bus, repository, reuse
        self.programs, self.folders, self.providers = programs, folders, providers
        self.sources = sources
        self.shares, self.states, self.counts = shares, states, counts

    def prepare(self, command: StartHelper, actor: Actor) -> None:
        self.sandbox.check()

    def handle(self, command: StartHelper, context: Context) -> HelperStarted:
        if len(command.brief) > BRIEF_LIMIT_CHARACTERS:
            raise Refusal(f"a brief is at most {BRIEF_LIMIT_CHARACTERS} characters", "put the text in journal doc make and name the document in the brief")
        profile = self.profiles.effective(command.profile)
        agent_type = self.types.find(profile.agent_type)
        if agent_type.start_line:
            raise Refusal(f"{profile.name} is a {agent_type.label}: use {agent_type.start_line}")
        self.limits.checked_launcher()
        parent = self.limits.checked_parent(context)
        self.limits.checked_new_place(profile.name)
        reuses_helpers = not command.new_agent_reason.strip() and not profile.independent
        if reuses_helpers:
            self.check_reuse(parent, profile, command.brief)
        selection = self.startable_program(command, profile, parent)
        if reuses_helpers:
            self.check_idle(profile, selection.program, selection.model)
        start = StartAgent(str(uuid4()), selection.program, agent_type.key, parent.id, program_model=selection.model, profile=profile.name, given_name=command.given_name, access=profile.access or agent_type.access)
        source_context = replace(context, environment_id=parent.environment_id)
        source = self.sources.source_copy(source_context)
        helper = self.bus.dispatch(start, context)
        self.repository.save(HelperJob(session_agent_id=parent.id, creator_id=context.actor.id, tool_key=helper.session, helper_id=helper.id, profile=profile.name, program_model=selection.model,
                                       description=command.given_name or profile.name, brief=command.brief, new_agent_reason=INDEPENDENT_REASON if profile.independent and not command.new_agent_reason.strip() else command.new_agent_reason.strip(), review_plan_id=command.review_plan_id, instruction=command.brief[:SHORT_BRIEF_CHARACTERS],
                                       source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, started_at=context.timestamp), context)
        self.sources.use_copy(source, source_context)
        self.bus.dispatch(CountProfileUse(profile.name), context)
        return HelperStarted(helper, selection.note)

    def startable_program(self, command: StartHelper, profile: AgentProfile, parent: Agent) -> HelperProgram:
        preferred = self.selected_program(command, profile, parent)
        try:
            model = self.checked_start(preferred, command.program_model, profile, parent, command.tier)
            return HelperProgram(preferred, model, self.availability_note(command, preferred))
        except Refusal as refusal:
            if not (profile.program_if_possible and profile.program and not command.program):
                raise
            for fallback_program in (provider.name for provider in self.providers.all() if provider.name != preferred):
                try:
                    return HelperProgram(fallback_program, self.checked_start(fallback_program, "", profile, parent, command.tier),
                                         f"{profile.program} could not start ({refusal.text}), so it runs on {fallback_program}")
                except Refusal:
                    continue
            raise refusal from None

    def selected_program(self, command: StartHelper, profile: AgentProfile, parent: Agent) -> str:
        if command.program:
            return command.program
        if command.program_model:
            return self.providers.model_program(command.program_model)
        if profile.program:
            return profile.program
        if profile.mcp_tools:
            return parent.program
        if not self.shares.is_configured:
            return parent.program
        folder = self.folders.folder(parent)
        readiness = self.states.readiness(folder)
        program = self.shares.next_program(self.counts.recent(parent.environment_id), readiness.ready_programs)
        if program is None:
            raise Refusal(f"no program can take this helper: {readiness.earliest_line}", "name --program explicitly, or wait")
        return program

    def availability_note(self, command: StartHelper, program: str) -> str:
        if not command.program:
            return ""
        state = self.states.allowance_state(program)
        if state.is_ready:
            return ""
        availability = f" until {state.ends_at.text}" if state.ends_at is not None else ""
        return f"{program} is out{availability}: {state.line}; started as requested"

    def checked_start(self, program: str, program_model: str, profile: AgentProfile, parent: Agent, tier: ModelTier | None) -> str:
        model = self.limits.checked_model(program, program_model or self.models.model(profile, self.providers.provider(program), tier))
        self.programs.checked(program, self.folders.folder(parent))
        return model

    def check_idle(self, profile: AgentProfile, program: str, model: str) -> None:
        idle_helpers = self.kept.idle(profile.name, program, model)
        if idle_helpers:
            raise self.kept.idle_refusal(idle_helpers)

    def check_reuse(self, parent: Agent, profile: AgentProfile, brief: str) -> None:
        job = self.reuse.known_job(parent.id, profile.name, brief)
        if job is not None:
            helper = next((helper for helper in self.kept.kept(profile.name) if helper.id == job.helper_id), None)
            if helper is not None:
                self.kept.check_program(helper)
            raise Refusal(f"agent:{job.helper_id} knows these files", f"journal helper send {job.helper_id} \"<job>\", or start a new one with --fresh")
