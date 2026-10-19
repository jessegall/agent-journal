import re

from journal.engine.agent_state import AgentState
from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.features.registry import Registry
from journal.features.skill import Skill
from journal.features.skills.skill_files import SkillFiles
from journal.support.actor import Actor
from journal.models.agent import Agent
from journal.repositories.agents import Agents


class Requiring:
    """What every moment of requiring shares: which skills an agent still owes, as a fact on its row, and the line that says where each file is."""

    def __init__(self, machine: Machine, registry: Registry, files: SkillFiles, nudger: Nudger, agents: Agents) -> None:
        self.machine, self.registry, self.files, self.nudger, self.agents = machine, registry, files, nudger, agents

    def owes_anything(self, agent: Agent) -> bool:
        """Whether the agent owes the journal the look at what is in flight, a decision at a context mark or a skill's read."""
        return not agent.oriented or bool(agent.mark_owed) or bool(self.owed_names(agent))

    def owed_names(self, agent: Agent) -> list[str]:
        """The skills the agent owes a read of, by name."""
        return list(agent.skills_owed)

    def owe(self, agent: Agent, skills: list[Skill]) -> None:
        """The skills owed beside those already owed, in one write, so none owed in the same moment is lost."""
        owed = (*agent.skills_owed, *(skill.name for skill in skills if skill.name not in agent.skills_owed))
        if owed != agent.skills_owed:
            self.agents.touch(agent, Actor.system(), skills_owed=tuple(dict.fromkeys(owed)))

    def paid(self, agent: Agent, skill: Skill) -> None:
        owed = self.owed_names(agent)
        if skill.name in owed:
            self.agents.touch(agent, Actor.system(), skills_owed=tuple(name for name in owed if name != skill.name))

    def owed(self, agent: Agent, skills: list[Skill]) -> list[Skill]:
        loaded = agent.skills_loaded or {}
        return [skill for skill in skills if loaded.get(skill.name) != self.files.hash_of(skill)]

    def for_state(self, state: AgentState) -> list[Skill]:
        skill = self.registry.skill_required_in(state.name)
        return [skill] if skill else []

    def named(self, name: str) -> list[Skill]:
        skill = self.registry.skill_named(name)
        return [skill] if skill else []

    def named_in(self, prompt: str) -> list[Skill]:
        """The skills whose keywords the prompt names."""
        words = {w.lower() for w in re.findall(r"[a-z]+", prompt, re.I)}
        return [skill for skill in self.registry.skills() if words & {k.lower() for k in skill.keywords}]

    def require(self, agent: Agent, skills: list[Skill]) -> list[str]:
        """Each skill owed is noted on the agent's row, with the line that says where its file is; nothing is owed while the skills feature is off, as nothing would pay it."""
        from journal.features.skills.feature import Skills
        if self.registry.silenced(Skills.REQUIRED):
            return []
        self.owe(agent, skills)
        return [line for skill in skills if (line := self.nudger.say(agent, Skills.REQUIRED.about(skill=skill.name, path=self.path_of(skill))))]

    def path_of(self, skill: Skill):
        """Where the skill's file is, from the project's root."""
        return self.files.path(skill).relative_to(self.files.config.root)
