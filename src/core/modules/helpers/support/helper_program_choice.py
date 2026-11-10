from engine.driver.program_lockdown import ProgramLockdown
from engine.enums.model_tier import ModelTier
from engine.errors.refusal import Refusal
from engine.profile.agent_profile import AgentProfile
from engine.provider.providers import Providers
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.helpers.support.helper_counts import HelperCounts
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_program import HelperProgram
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.profile_model import ProfileModel
from core.modules.helpers.support.profile_models import ProfileModels
from core.modules.helpers.support.program_request import ProgramRequest
from core.modules.helpers.support.program_shares import ProgramShares
from core.modules.helpers.support.program_states import ProgramStates


class HelperProgramChoice:
    """Picks the program and model a helper of a profile starts on: the profile's program, its fallbacks when it
    cannot start, else the program split."""

    def __init__(self, providers: Providers, shares: ProgramShares, states: ProgramStates, counts: HelperCounts, folders: AgentFolders, lockdown: ProgramLockdown,
                 limits: HelperLimits, models: ProfileModels, programs: HelperPrograms) -> None:
        self.providers, self.shares, self.states, self.counts, self.folders = providers, shares, states, counts, folders
        self.lockdown, self.limits, self.models, self.programs = lockdown, limits, models, programs

    def startable(self, profile: AgentProfile, parent: Agent, requested: ProgramRequest) -> HelperProgram:
        preferred = self.selected_program(requested, profile, parent)
        try:
            model = self.checked_start(preferred, requested.program_model, profile, parent, requested.tier)
            return HelperProgram(preferred, model, self.availability_note(requested, preferred))
        except Refusal as refusal:
            if not (profile.preferred_program and profile.program and not requested.program):
                raise
            for fallback_program in profile.fallbacks_after(preferred, [provider.name for provider in self.providers.all()]):
                try:
                    return HelperProgram(fallback_program, self.checked_start(fallback_program, "", profile, parent, requested.tier),
                                         f"{profile.program} could not start ({refusal.text}), so it runs on {fallback_program}")
                except Refusal:
                    continue
            raise refusal from None

    def selected_program(self, requested: ProgramRequest, profile: AgentProfile, parent: Agent) -> str:
        if requested.program:
            return requested.program
        if requested.program_model:
            return self.providers.model_program(requested.program_model)
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

    def availability_note(self, requested: ProgramRequest, program: str) -> str:
        if not requested.program:
            return ""
        state = self.states.plan_window_state(program)
        if state.is_ready:
            return ""
        availability = f" until {state.ends_at.text}" if state.ends_at is not None else ""
        return f"{program} is out{availability}: {state.line}; started as requested"

    def checked_start(self, program: str, program_model: str, profile: AgentProfile, parent: Agent, tier: ModelTier | None) -> str:
        lockdown = self.lockdown.lockdown(program)
        if lockdown.is_active:
            raise lockdown.start_refusal("helper")
        model = self.limits.checked_profile_model(ProfileModel(program, program_model or self.models.model(profile, self.providers.provider(program), tier, "helper"), profile.name))
        self.programs.checked(program, self.folders.folder(parent))
        return model
