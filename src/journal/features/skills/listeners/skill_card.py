from journal.chat.moment_cards import MomentCards
from journal.events.agent.tool_finished import ToolFinished
from journal.events.agent_listener import AgentListener
from journal.support.skill import Skill
from journal.features.skills.support.skill_files import SkillFiles
from journal.support.actor import Actor
from journal.repositories.agents import Agents
from journal.support.card_kind import CardKind
from journal.engine.clock import Clock


class SkillCard(AgentListener[ToolFinished]):
    """A read of our skill files, by the read tool, a shell line or the skill tool, is remembered on the agent with each file's hash, added to what it holds under the write lock, so two reads sent together are both kept."""

    blocking = True

    def __init__(self, agents: Agents, files: SkillFiles, cards: MomentCards, clock: Clock) -> None:
        self.agents, self.files, self.cards, self.clock = agents, files, cards, clock

    def handle(self, event: ToolFinished) -> None:
        read = [self.files.skill_read(path) for path in event.call.read_paths] + [self.files.folder_skill(event.call.skill_loaded) if event.call.skill_loaded else None]
        for skill in [s for s in read if s is not None]:
            self.loaded(event, skill)

    def loaded(self, event: ToolFinished, skill: Skill) -> None:
        digest = self.files.digest(skill)
        self.agents.rewritten(self.agents.session_agent(event.session), Actor.system(), lambda time: time.skill_read(skill.name, digest, self.clock.time()))
        self.cards.show(event.environment_id, event.session, f"Skill {skill.name} loaded", "book", "good", skill.name, kind="skill", shows=CardKind.SKILLS)
