import re

from journal.engine.base_state import BaseState
from journal.engine.state_machine import StateMachine
from journal.engine.nudger import Nudger
from journal.features.registry import Registry
from journal.support.skill import Skill
from journal.support.skill_files import SkillFiles
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.repositories.agents import Agents


class Requirements:
    """What every moment of requiring shares: which skills an agent still owes, as a fact on its row, and the line that says where each file is."""

    def __init__(self, machine: StateMachine, registry: Registry, files: SkillFiles, nudger: Nudger, agents: Agents) -> None:
        self.machine, self.registry, self.files, self.nudger, self.agents = machine, registry, files, nudger, agents

    def owes_anything(self, agent: Agent) -> bool:
        return not agent.oriented or bool(agent.mark_owed) or bool(self.owed_names(agent))

    def owed_names(self, agent: Agent) -> list[str]:
        return list(agent.skills_owed)

    def owe(self, agent: Agent, skills: list[Skill]) -> None:
        names = tuple(skill.name for skill in skills)
        if set(names) - set(agent.skills_owed):
            self.agents.touched(agent, Actor.system(), lambda time: {"skills_owed": tuple(dict.fromkeys((*time.skills_owed, *names)))})

    def paid(self, agent: Agent, skill: Skill) -> None:
        if skill.name in agent.skills_owed:
            self.agents.touched(agent, Actor.system(), lambda time: {"skills_owed": tuple(name for name in time.skills_owed if name != skill.name)})

    def owed(self, agent: Agent, skills: list[Skill]) -> list[Skill]:
        loaded = agent.skills_loaded
        return [skill for skill in skills if loaded.get(skill.name) != self.files.hash_of(skill)]

    def for_state(self, state: BaseState) -> list[Skill]:
        skill = self.registry.skill_required_in(state.name)
        return [skill] if skill else []

    def named(self, name: str) -> list[Skill]:
        skill = self.registry.skill_named(name)
        return [skill] if skill else []

    def named_in(self, prompt: str) -> list[Skill]:
        text = {w.lower() for w in re.findall(r"[a-z]+", prompt, re.I)}
        return [skill for skill in self.registry.skills() if text & {k.lower() for k in skill.keywords}]

    def require(self, agent: Agent, skills: list[Skill]) -> list[str]:
        from journal.features.skills.feature import Skills
        if self.registry.silenced(Skills.SKILL_READ_REQUEST):
            return []
        self.owe(agent, skills)
        return [line for skill in skills if (line := self.nudger.say(agent, Skills.SKILL_READ_REQUEST.create(skill=skill.name, path=self.path_of(skill))))]

    def path_of(self, skill: Skill):
        return self.files.path(skill).relative_to(self.files.config.root)
