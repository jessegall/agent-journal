from core.base.caller.caller import Caller
from core.base.provider.providers import Providers
from core.base.refusal import Refusal
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.helper_programs import HelperPrograms
from core.modules.helpers.support.helper_start_state import HelperStartState
from core.modules.helpers.support.program_states import ProgramStates
from core.modules.agents.support.agent_folders import AgentFolders
from core.modules.helpers.support.kept_helpers import KeptHelpers
from core.modules.profiles.support.profile_files import ProfileFiles


class HelperAvailability:
    """Reads the command's helper limits and reusable sessions for the profile selected in the form."""

    def __init__(self, limits: HelperLimits, providers: Providers, profiles: ProfileFiles, kept: KeptHelpers, programs: HelperPrograms, states: ProgramStates, folders: AgentFolders) -> None:
        self.limits, self.providers, self.profiles, self.kept, self.programs = limits, providers, profiles, kept, programs
        self.states, self.folders = states, folders

    def state(self, caller: Caller, profile: str | None, program: str) -> HelperStartState:
        programs: tuple[str, ...] = ()
        try:
            self.limits.checked_launcher()
            parent = self.limits.checked_parent(caller)
            programs = self.states.ready_programs(self.folders.folder(parent))
            if profile is None:
                return HelperStartState(None, programs, can_start_new=True)
            selected_profile = self.profiles.effective(profile)
            selected_program = program or selected_profile.program or parent.program
            self.programs.installed(selected_program)
            model = self.limits.checked_model(selected_program, self.providers.provider(selected_program).profile_model(selected_profile))
            self.limits.checked_running(profile)
            idle = self.kept.idle(profile, selected_program, model)
            try:
                self.limits.checked_kept(profile)
            except Refusal as refusal:
                return HelperStartState(refusal.text, programs, idle, False, refusal.text)
            reason = self.kept.idle_refusal(idle).text if idle and not selected_profile.independent else None
            return HelperStartState(reason, programs, idle, True)
        except Refusal as refusal:
            return HelperStartState(refusal.text, programs)
