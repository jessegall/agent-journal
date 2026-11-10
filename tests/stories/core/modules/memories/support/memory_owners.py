from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from core.base.query.queries import Queries
from core.modules.agents.models.agent import Agent
from core.modules.memories.models.memory import Memory
from core.testing.story_fixture import StoryFixture
from tests.stories.core.support.coding_fixtures import UserBuilder

MAIN_MEMORY = 1
WORKER_MEMORY = 2
MAIN_FACT = "The queue is on"
WORKER_FACT = "My worktree is clean"


def started_agent(story, session, role="worker"):
    return Actor(story.new_row_id(f"agent start {session} claude {role} --environment main"), ActorType.AGENT)


def read_agent(story, session):
    return Actor(story.container.get(Queries).query(Agent).filter(session=session).first().id, ActorType.AGENT)


def stored_memory(story, memory_id):
    return story.container.get(Queries).query(Memory).find(memory_id)


def expect_hidden(story, memory_id, text, actor):
    story.expect_no_text("memory list", text, actor=actor)
    story.expect_text(f'search find "{text}"', "nothing here holds all of", actor=actor)
    story.expect_refusal(f"memory show {memory_id}", "no memory", actor=actor)
    story.expect_refusal(f"memory read {memory_id}", "no memory", actor=actor)
    story.expect_refusal(f"memory weigh {memory_id} 8", "no memory", actor=actor)
    story.expect_refusal(f'memory edit {memory_id} --text "Changed"', "no memory", actor=actor)


class MainAndWorkerMemories(StoryFixture):
    """The main agent in session s-1 with memory 1, and a worker in session s-9 with memory 2."""

    parent = UserBuilder

    def steps(self, story):
        story.run(f'memory make "{MAIN_FACT}" --environment main', actor=story.agent)
        story.run(f'memory make "{WORKER_FACT}" --environment main', actor=started_agent(story, "s-9"))

    def expect(self, story):
        story.expect_text("memory list", MAIN_FACT, actor=story.agent)
        story.expect_text("memory list", WORKER_FACT, actor=read_agent(story, "s-9"))
