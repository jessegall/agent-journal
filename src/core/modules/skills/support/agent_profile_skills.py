from collections.abc import Callable

from engine.profile.agent_profile import AgentProfile
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
        return self.refused(agent_id)(folder)

    # the profile is read once, and the answer asks it for any number of skills
    def refused(self, agent_id: int) -> Callable[[str], bool]:
        profile = self.readable_profile(agent_id)
        return (lambda folder: False) if profile is None else self.skills.refused(profile)

    # the kind of agent a skill is written for: its profile's type, or main for a main agent without a profile
    def agent_type(self, agent_id: int) -> str:
        profile = self.readable_profile(agent_id)
        return str(self.agents.find(agent_id).role) if profile is None else profile.agent_type

    def required(self, agent_id: int) -> tuple[str, ...]:
        profile = self.readable_profile(agent_id)
        return () if profile is None else profile.required_skills

    def readable_profile(self, agent_id: int) -> AgentProfile | None:
        name = self.agents.find(agent_id).profile
        profile = self.profiles.row(name) if self.profiles.has(name) else None
        return None if isinstance(profile, ProfileProblem) else profile
