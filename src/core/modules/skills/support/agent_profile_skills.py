from core.modules.agents.support.agent_rows import AgentRows
from core.modules.profiles.support.profile_files import ProfileFiles
from core.modules.profiles.support.profile_problem import ProfileProblem
from core.modules.skills.support.profile_skills import ProfileSkills


class AgentProfileSkills:
    """Whether an agent's profile leaves a skill out; an agent with no readable profile is left every skill."""

    def __init__(self, agents: AgentRows, profiles: ProfileFiles, skills: ProfileSkills) -> None:
        self.agents, self.profiles, self.skills = agents, profiles, skills

    def refuses(self, agent_id: int, folder: str) -> bool:
        name = self.agents.find(agent_id).profile
        profile = self.profiles.row(name) if self.profiles.has(name) else None
        return profile is not None and not isinstance(profile, ProfileProblem) and self.skills.refuses(profile, folder)
