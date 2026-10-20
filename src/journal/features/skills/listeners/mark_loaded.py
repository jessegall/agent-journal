from journal.support.cards import Cards
from journal.engine.state_machine import StateMachine
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.support.skill import Skill
from journal.support.requiring import Requiring
from journal.support.skill_files import SkillFiles
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.support.chat_mark import ChatMark


class MarkLoaded(AgentListener[ToolFinished]):
    """A read of our skill files, by the read tool, a shell line or the skill tool, is remembered on the agent with each file's hash, added to what it holds under the write lock, so two reads sent together are both kept."""

    blocking = True

    def __init__(self, machine: StateMachine, agents: Agents, files: SkillFiles, cards: Cards, requiring: Requiring) -> None:
        self.machine, self.agents, self.files, self.cards, self.requiring = machine, agents, files, cards, requiring

    def handle(self, event: ToolFinished) -> None:
        read = [self.files.skill_read(path) for path in event.read_paths] + [self.files.skill_in_folder(event.skill_loaded) if event.skill_loaded else None]
        for skill in [s for s in read if s is not None]:
            self.loaded(event, skill)

    def loaded(self, event: ToolFinished, skill: Skill) -> None:
        agent = self.machine.agent(event.session, event.environment_id)
        digest = self.files.hash_of(skill)
        self.agents.touched(agent, Actor.system(), lambda now: {"skills_loaded": {**(now.skills_loaded or {}), skill.name: digest}})
        self.requiring.paid(agent, skill)
        self.cards.show(event.environment_id, event.session, f"Skill {skill.name} loaded", "book", "good", skill.name, kind="skill", shows=ChatMark.SKILLS)
