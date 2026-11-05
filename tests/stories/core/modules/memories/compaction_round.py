import pytest

from tests.stories.core.modules.memories.fading_at_compaction import compacted
from tests.stories.core.modules.memories.support.round_checks import expect_browser_round, expect_faded_mark_count, expect_round
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.server_client import server_story

pytestmark = pytest.mark.browser_job


def test_the_round_and_browser_count_only_memories_changed_by_this_compaction(new_story):
    story = new_story(fixture=BuilderStarted)
    prior_round = story.new_row_id('memory make "An earlier round faded this" --weight 0 --environment main')
    shown = story.new_row_id('memory make "The cart stores cents" --weight 2 --environment main')
    faded = story.new_row_id('memory make "The last temporary detail" --weight 1 --environment main')
    compacted(story)
    mark = expect_round(story, [(shown, 2, 1)], [(faded, 1, 0)], [prior_round])
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser_round(server, mark.id, [shown], [faded], [prior_round])


def test_an_already_faded_memory_is_not_reported_again_at_the_next_compaction(new_story):
    story = new_story(fixture=BuilderStarted)
    memory = story.new_row_id('memory make "One temporary detail" --weight 1 --environment main')
    compacted(story)
    expect_round(story, [], [(memory, 1, 0)], [])
    compacted(story)
    expect_faded_mark_count(story, 1)
