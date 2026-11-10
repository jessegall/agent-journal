from core.base.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.memories.support.memory_owners import MAIN_FACT, MainAndWorkerMemories
from core.testing.story_fixture import StoryFixture

STAGING_START = "agent start s-20 claude main --environment staging"


def staging_main(story):
    return Actor(story.new_row_id(STAGING_START), ActorType.AGENT)


class StagingEnvironment(StoryFixture):
    """A second environment, staging, beside the memories of main."""

    parent = MainAndWorkerMemories

    def steps(self, story):
        story.run("environment make staging /work/staging")

    def expect(self, story):
        story.expect_success("environment show 2", "name: staging")


def test_a_main_agent_never_reads_a_memory_of_another_environment_by_its_number(new_story):
    story = new_story(fixture=StagingEnvironment)
    story.expect_refusal("memory show 1", "no memory", actor=staging_main(story))


def test_a_main_agent_s_memory_stays_in_its_environment(new_story):
    story = new_story(fixture=StagingEnvironment)
    story.run('memory make "Staging has no queue" --environment staging', actor=staging_main(story))
    story.expect_no_text("memory list", "Staging has no queue", actor=story.agent)


def test_a_memory_a_person_makes_waits_for_the_first_main_agent_of_that_environment(new_story):
    story = new_story(fixture=StagingEnvironment)
    story.run('memory make "Staging has no queue" --environment staging', actor=story.user)
    story.expect_text("memory list", "Staging has no queue", actor=staging_main(story))


def test_a_person_sees_the_memories_of_every_environment(new_story):
    story = new_story(fixture=StagingEnvironment)
    story.run('memory make "Staging has no queue" --environment staging', actor=story.user)
    story.expect_text("memory list", "Staging has no queue", MAIN_FACT, actor=story.user)
