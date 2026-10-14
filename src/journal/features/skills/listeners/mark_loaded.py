from journal.engine.machine import Machine
from journal.events.agent.tool_finished import ToolFinished
from journal.features.agent_listener import AgentListener
from journal.features.skills.skill_files import SkillFiles
from journal.models.actor import Actor
from journal.repositories.agents import Agents


class MarkLoaded(AgentListener[ToolFinished]):
    """A read of one of our skill files is remembered on the agent, with the file's hash."""

    blocking = True

    def __init__(self, machine: Machine, agents: Agents, files: SkillFiles) -> None:
        self.machine, self.agents, self.files = machine, agents, files

    def handle(self, event: ToolFinished) -> None:
        skill = self.files.skill_read(event.read_path) if event.read_path else None
        if skill is None:
            return
        agent = self.machine.agent(event.session, event.environment_id)
        self.agents.save(agent.with_(skills_loaded={**(agent.skills_loaded or {}), skill.name: self.files.hash_of(skill)}), Actor.system())
