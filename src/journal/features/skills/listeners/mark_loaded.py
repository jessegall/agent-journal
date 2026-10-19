from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.features.skill import Skill
from journal.features.skills.requiring import Requiring
from journal.features.skills.skill_files import SkillFiles
from journal.models.actor import Actor
from journal.repositories.agents import Agents


class MarkLoaded(AgentListener[ToolFinished]):
    """A read of our skill files, by the read tool, a shell line or the skill tool, is remembered on the agent with each file's hash."""

    blocking = True

    def __init__(self, machine: Machine, agents: Agents, files: SkillFiles, cards: Cards, requiring: Requiring) -> None:
        self.machine, self.agents, self.files, self.cards, self.requiring = machine, agents, files, cards, requiring

    def handle(self, event: ToolFinished) -> None:
        read = [self.files.skill_read(path) for path in event.read_paths] + [self.files.skill_in_folder(event.skill_loaded) if event.skill_loaded else None]
        for skill in [s for s in read if s is not None]:
            self.loaded(event, skill)

    def loaded(self, event: ToolFinished, skill: Skill) -> None:
        agent = self.machine.agent(event.session, event.environment_id)
        self.agents.touch(agent, Actor.system(), skills_loaded={**(agent.skills_loaded or {}), skill.name: self.files.hash_of(skill)})
        self.requiring.paid(agent, skill)
        self.cards.show(event.environment_id, event.session, f"Skill {skill.name} loaded", "book", "good", skill.name, kind="skill")
