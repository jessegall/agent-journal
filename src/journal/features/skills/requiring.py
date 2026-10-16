from journal.engine.agent_state import AgentState
from journal.engine.machine import Machine
from journal.engine.nudger import Nudger
from journal.features.registry import Registry
from journal.features.skill import Skill
from journal.features.skills.skill_files import SkillFiles
from journal.features.skills.states.loading_skill import LoadingSkill
from journal.models.actor import Actor
from journal.models.agent import Agent
from journal.models.link import Link
from journal.models.ref import Ref
from journal.repositories.links import Links

OWES = "owes:"
"""The kind of a link from an agent to a skill it owes a read of, by the skill's name after the colon."""


class Requiring:
    """What every moment of requiring shares: which skills an agent still owes, and holding it at each until it has read them."""

    def __init__(self, machine: Machine, registry: Registry, files: SkillFiles, nudger: Nudger, links: Links) -> None:
        self.machine, self.registry, self.files, self.nudger, self.links = machine, registry, files, nudger, links

    def owed_names(self, agent: Agent) -> list[str]:
        """The skills the agent owes a read of, by name, as its links say."""
        return [link.kind[len(OWES):] for link in self.links.of(agent) if link.kind.startswith(OWES) and link.source == Ref.to(agent)]

    def owe(self, agent: Agent, skill: Skill) -> None:
        if skill.name not in self.owed_names(agent):
            self.links.save(Link(source=Ref.to(agent), kind=f"{OWES}{skill.name}"), Actor.system())

    def paid(self, agent: Agent, skill: Skill) -> None:
        for link in [l for l in self.links.of(agent) if l.kind == f"{OWES}{skill.name}"]:
            self.links.delete(link, Actor.system())

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
        for skill in skills:
            self.owe(agent, skill)
        self.machine.move(agent.session, agent.environment_id, current)
        return [line for skill in skills if (line := self.nudger.say(agent, Skills.REQUIRED.about(skill=skill.name, path=self.files.path(skill).relative_to(self.files.config.root))))]
