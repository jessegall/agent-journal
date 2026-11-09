from core.base.profile.agent_profile import AgentProfile
from core.modules.agents.support.agent_rows import AgentRows
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.skills.support.profile_skills import ProfileSkills


class AgentProfileSkills:
    """Whether an agent's profile leaves a skill out, and which skills it requires; an agent with no readable
    profile is left every skill and required to read none."""

    def __init__(self, agents: AgentRows, profiles: ProfileFiles, skills: ProfileSkills) -> None:
        self.agents, self.profiles, self.skills = agents, profiles, skills

    def refuses(self, agent_id: int, folder: str) -> bool:
        profile = self.readable_profile(agent_id)
        return profile is not None and self.skills.refuses(profile, folder)

    def required(self, agent_id: int) -> tuple[str, ...]:
        profile = self.readable_profile(agent_id)
        return () if profile is None else profile.required_skills

    def readable_profile(self, agent_id: int) -> AgentProfile | None:
        name = self.agents.find(agent_id).profile
        profile = self.profiles.row(name) if self.profiles.has(name) else None
        return None if isinstance(profile, ProfileProblem) else profile
