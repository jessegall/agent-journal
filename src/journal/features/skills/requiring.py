from journal.engine.agent_state import AgentState
from journal.engine.machine import Machine
from journal.features.registry import Registry
from journal.features.skill import Skill
from journal.features.skills.skill_files import SkillFiles
from journal.features.skills.states.loading_skill import LoadingSkill
from journal.models.agent import Agent


class Requiring:
    """What every moment of requiring shares: which skills an agent still owes, and holding it at each until it has read them."""

    def __init__(self, machine: Machine, registry: Registry, files: SkillFiles) -> None:
        self.machine, self.registry, self.files = machine, registry, files

    def owed(self, agent: Agent, skills: list[Skill]) -> list[Skill]:
        loaded = agent.skills_loaded or {}
        return [skill for skill in skills if loaded.get(skill.name) != self.files.hash_of(skill)]

    def for_state(self, state: AgentState) -> list[Skill]:
        skill = self.registry.skill_required_in(state.name)
        return [skill] if skill else []

    def hold(self, agent: Agent, skills: list[Skill]) -> list[str]:
        """Pauses the agent once per skill, innermost first read, and says each line."""
        from journal.features.skills.feature import Skills
        if not skills:
            return []
        current = self.machine.states.named(agent.state, agent.data)
        if isinstance(current, LoadingSkill):
            return []
        for skill in reversed(skills):
            current = LoadingSkill.leaving(current, skill=skill.name, path=str(self.files.path(skill).relative_to(self.files.config.root)))
        self.machine.move(agent.session, agent.environment_id, current)
        return [Skills.REQUIRED.about(skill=skill.name, path=self.files.path(skill).relative_to(self.files.config.root)).rendered() for skill in skills]
