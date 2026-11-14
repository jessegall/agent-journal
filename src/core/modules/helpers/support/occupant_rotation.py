from engine.command.bus import Bus
from engine.command.context import Context
from engine.profile.agent_profile import AgentProfile
from core.modules.agents.commands.replace_agent_session.replace_agent_session import ReplaceAgentSession
from core.modules.agents.models.agent import Agent
from core.modules.agents.models.enums.end_reason import EndReason
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.helpers.support.helper_limits import HelperLimits
from core.modules.helpers.support.program_request import ProgramRequest
from core.modules.helpers.support.ready_program_choice import ReadyProgramChoice
from core.modules.profiles.support.profile_files import ProfileFiles


class OccupantRotation:
    """Gives a kept helper whose profile replaces its session at each launch a new session before its next job
    is saved, on the program and model its profile picks now. The switch for new sessions is not asked: the
    agent stays, so only the switch for resuming and the model of the new session are checked."""

    def __init__(self, profiles: ProfileFiles, limits: HelperLimits, choice: ReadyProgramChoice, agents: AgentRows, bus: Bus) -> None:
        self.profiles, self.limits, self.choice, self.agents, self.bus = profiles, limits, choice, agents, bus

    def profile(self, helper: Agent) -> AgentProfile | None:
        if not helper.profile:
            return None
        profile = self.profiles.effective(helper.profile)
        return profile if profile.occupant.may_change_program else None

    def rotated(self, helper: Agent, profile: AgentProfile, parent_id: int, context: Context) -> Agent:
        self.limits.checked_resume(profile.name)
        selection = self.choice.startable(profile, self.agents.find(parent_id), ProgramRequest())
        return self.bus.dispatch(ReplaceAgentSession(helper.id, EndReason.LAUNCH_ROTATION, selection.program, selection.model), context)
