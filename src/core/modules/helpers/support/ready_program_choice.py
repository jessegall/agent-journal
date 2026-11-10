from engine.enums.model_tier import ModelTier
from engine.errors.refusal import Refusal
from engine.profile.agent_profile import AgentProfile
from core.modules.agents.models.agent import Agent
from core.modules.helpers.support.helper_program_choice import HelperProgramChoice


class ReadyProgramChoice(HelperProgramChoice):
    """Picks the program and model for a launch that no line names a program for: a program that is out cannot
    start, so the profile's next program is chosen."""

    def checked_start(self, program: str, program_model: str, profile: AgentProfile, parent: Agent, tier: ModelTier | None) -> str:
        state = self.states.outage_state(program)
        if not state.is_ready:
            raise Refusal(f"{program} is out: {state.wait_line}", "wait until it is back")
        return super().checked_start(program, program_model, profile, parent, tier)
