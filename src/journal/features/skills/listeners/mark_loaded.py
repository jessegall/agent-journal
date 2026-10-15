from journal.engine.cards import Cards
from journal.engine.machine import Machine
from journal.events.agent.tool_finished import ToolFinished
from journal.features.agent_listener import AgentListener
from journal.features.skills.skill_files import SkillFiles
from journal.models.actor import Actor
from journal.repositories.agents import Agents


class MarkLoaded(AgentListener[ToolFinished]):
    """A read of one of our skill files, or the skill tool loading one, is remembered on the agent with the file's hash."""

    blocking = True

    def __init__(self, machine: Machine, agents: Agents, files: SkillFiles, cards: Cards) -> None:
        self.machine, self.agents, self.files, self.cards = machine, agents, files, cards

    def handle(self, event: ToolFinished) -> None:
        skill = self.files.skill_read(event.read_path) if event.read_path else self.files.skill_in_folder(event.skill_loaded) if event.skill_loaded else None
        if skill is None:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        self.agents.save(agent.with_(skills_loaded={**(agent.skills_loaded or {}), skill.name: self.files.hash_of(skill)}), Actor.system())
        self.cards.show(event.environment_id, event.session, f"Skill {skill.name} loaded", "book", "good")
