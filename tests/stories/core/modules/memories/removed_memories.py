from engine.query.queries import Queries
from core.testing.story_fixture import StoryFixture
from core.modules.memories.models.memory import Memory
from tests.stories.core.support.coding_fixtures import StartedTaskBuilder
from tests.stories.support.story_checks import expect_value

KEPT, REMOVED = "The release waits for the tag", "The old server name"
REMOVED_ID = 2


class OneMemoryRemoved(StoryFixture):
    """The main agent holds one memory and removed another."""

    parent = StartedTaskBuilder

    def steps(self, story):
        story.run(f'memory make "{KEPT}"', actor=story.agent)
        story.run(f'memory make "{REMOVED}"', actor=story.agent)
        story.run(f'memory remove {REMOVED_ID} --reason "The server was renamed"', actor=story.agent)


def test_the_memory_list_leaves_a_removed_memory_out(new_story):
    story = new_story(fixture=OneMemoryRemoved)
    story.expect_text("memory list", KEPT, actor=story.agent)
    story.expect_no_text("memory list", REMOVED, actor=story.agent)


def test_the_memory_list_shows_a_removed_memory_when_asked(new_story):
    story = new_story(fixture=OneMemoryRemoved)
    story.expect_text("memory list --removed", KEPT, REMOVED, actor=story.agent)


def test_a_query_leaves_a_removed_memory_out_of_its_rows_and_its_count(new_story):
    story = new_story(fixture=OneMemoryRemoved)
    memories = story.container.get(Queries).query(Memory)
    expect_value([row.text for row in memories.all_rows()], [KEPT])
    expect_value((memories.count(), memories.with_removed().count()), (1, 2))


def test_a_removed_memory_is_found_by_its_id(new_story):
    story = new_story(fixture=OneMemoryRemoved)
    story.expect_text(f"memory show {REMOVED_ID}", REMOVED, "state: removed", actor=story.agent)


def test_a_restored_memory_is_listed_again(new_story):
    story = new_story(fixture=OneMemoryRemoved)
    story.expect_success(f"memory restore {REMOVED_ID}", actor=story.agent)
    story.expect_text("memory list", REMOVED, actor=story.agent)
