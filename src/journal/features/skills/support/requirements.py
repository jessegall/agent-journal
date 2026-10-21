import re

from journal.engine.base_state import BaseState
from journal.engine.nudger import Nudger
from journal.features.registry import Registry
from journal.support.skill import Skill
from journal.features.skills.support.skill_files import SkillFiles
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.repositories.agents import Agents


class Requirements:
    """What every moment of requiring shares: which skills an agent still owes, as a fact on its row, and the line that says where each file is."""

    def __init__(self, registry: Registry, files: SkillFiles, nudger: Nudger, agents: Agents) -> None:
        self.registry, self.files, self.nudger, self.agents = registry, files, nudger, agents

    def has_obligations(self, agent: Agent) -> bool:
        return not agent.has_overview or bool(agent.threshold_due) or bool(self.obligation_names(agent))

    def obligation_names(self, agent: Agent) -> list[str]:
        return list(agent.skills_due)

    def obligation(self, agent: Agent, skills: list[Skill]) -> None:
        names = tuple(skill.name for skill in skills)
        if set(names) - set(agent.skills_due):
            self.agents.touched(agent, Actor.system(), lambda time: {"skills_due": tuple(dict.fromkeys((*time.skills_due, *names)))})

    def discharge(self, agent: Agent, skill: Skill) -> None:
        if skill.name in agent.skills_due:
            self.agents.touched(agent, Actor.system(), lambda time: {"skills_due": tuple(name for name in time.skills_due if name != skill.name)})

    def obligations(self, agent: Agent, skills: list[Skill]) -> list[Skill]:
        loaded = agent.skills_loaded
        return [skill for skill in skills if loaded.get(skill.name) != self.files.digest(skill)]

    def state_requirements(self, state: BaseState) -> list[Skill]:
        skill = self.registry.required_skill(state.name)
        return [skill] if skill else []

    def lookup(self, name: str) -> list[Skill]:
        skill = self.registry.skill(name)
        return [skill] if skill else []

    def mentioned(self, prompt: str) -> list[Skill]:
        text = {w.lower() for w in re.findall(r"[a-z]+", prompt, re.I)}
        return [skill for skill in self.registry.skills() if text & {k.lower() for k in skill.keywords}]

    def require(self, agent: Agent, skills: list[Skill]) -> list[str]:
        from journal.features.skills.feature import Skills
        if self.registry.silenced(Skills.SKILL_READ_REQUEST):
            return []
        self.obligation(agent, skills)
        return [line for skill in skills if (line := self.nudger.deliver(agent, Skills.SKILL_READ_REQUEST.create(skill=skill.name, path=self.path(skill))))]

    def path(self, skill: Skill) -> str:
        return self.files.relative_path(skill)
