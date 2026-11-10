from uuid import uuid4
from dataclasses import replace

from engine.actor.actor import Actor
from engine.sandbox.shell_sandbox import ShellSandbox
from engine.cli.row_numbers import RowNumbers
from engine.command.bus import Bus
from core.modules.agents.support.agent_label import AgentLabel
from engine.command.context import Context
from engine.command.handler import Handler
from engine.errors.refusal import Refusal
from engine.repository.repository import Repository
from engine.helper_type.helper_type_book import HelperTypeBook
from core.modules.agents.commands.start_agent.start_agent import StartAgent
from core.modules.agents.models.agent import Agent
from engine.profile.agent_profile import AgentProfile
from core.modules.drivers.models.helper_job import HelperJob
from core.modules.drivers.support.helper_reuse import HelperReuse
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.helpers.support.helper_started import HelperStarted
from core.modules.helpers.commands.start_helper.start_helper import StartHelper
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.profile_model import ProfileModel
from core.modules.helpers.support.helper_program_choice import HelperProgramChoice
from core.modules.helpers.support.program_request import ProgramRequest
from core.modules.usage.commands.count_profile_use.count_profile_use import CountProfileUse
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.messages.support.work_sources import WorkSources

BRIEF_LIMIT_CHARACTERS = 100000
SHORT_BRIEF_CHARACTERS = 200

INDEPENDENT_REASON = "An independent profile starts a new helper for its own view."

HELPER_WORD = "helper"


class StartHelperHandler(Handler[StartHelper, HelperStarted]):
    """Starts a helper of a profile as a process the journal owns, in the folder of the agent that asked. A profile
    that prefers its program only if possible starts on another program, with that program's model, when the
    preferred one cannot start, and the start says so."""

    command = StartHelper

    def __init__(self, profiles: ProfileFiles, types: HelperTypeBook, limits: HelperLimits, bus: Bus, repository: Repository, reuse: HelperReuse, sources: WorkSources, sandbox: ShellSandbox, kept: KeptHelpers, choice: HelperProgramChoice, numbers: RowNumbers) -> None:
        self.numbers = numbers
        self.kept, self.choice = kept, choice
        self.sandbox = sandbox
        self.profiles, self.types, self.limits, self.bus, self.repository, self.reuse = profiles, types, limits, bus, repository, reuse
        self.sources = sources

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
        self.limits.checked_new_session(profile.name)
        reuses_helpers = not command.new_agent_reason.strip() and not profile.independent
        if reuses_helpers:
            self.check_reuse(parent, profile, command.brief)
        selection = self.choice.startable(profile, parent, ProgramRequest(command.program, command.program_model, command.tier))
        if reuses_helpers:
            self.check_idle(profile, selection.program, selection.model)
        start = StartAgent(str(uuid4()), selection.program, agent_type.key, parent.id, program_model=selection.model, profile=profile.name, given_name=command.given_name, access=profile.access or agent_type.access)
        source_context = replace(context, environment_id=parent.environment_id)
        source = self.sources.source_copy(source_context)
        helper = self.bus.dispatch(start, context)
        self.repository.save(HelperJob(session_agent_id=parent.id, creator_id=context.actor.id, tool_key=helper.session, helper_id=helper.id, profile=profile.name, program_model=selection.model, program=selection.program,
                                       description=command.given_name or profile.name, title=command.title.strip(), brief=command.brief, new_agent_reason=INDEPENDENT_REASON if profile.independent and not command.new_agent_reason.strip() else command.new_agent_reason.strip(), review_plan_id=command.review_plan_id, instruction=command.brief[:SHORT_BRIEF_CHARACTERS],
                                       source_message_id=source.message_id, source_version=source.version, source_unavailable=source.unavailable, started_at=context.timestamp, cost_baseline=0.0), context)
        self.sources.use_copy(source, source_context)
        self.bus.dispatch(CountProfileUse(profile.name), context)
        return HelperStarted(helper, selection.note)

    def check_idle(self, profile: AgentProfile, program: str, model: str) -> None:
        idle_helpers = self.kept.idle(ProfileModel(program, model, profile.name))
        if idle_helpers:
            raise self.kept.idle_refusal(idle_helpers)

    def check_reuse(self, parent: Agent, profile: AgentProfile, brief: str) -> None:
        job = self.reuse.known_job(parent.id, profile.name, brief)
        if job is not None:
            helper = next((helper for helper in self.kept.kept(profile.name) if helper.id == job.helper_id), None)
            if helper is not None:
                self.kept.check_program(helper)
            label = AgentLabel.from_row_id(job.helper_id, self.numbers, HELPER_WORD)
            raise Refusal(f"{label.text} knows these files", f"journal helper send {label.number} \"<job>\", or start a new one with --fresh")
