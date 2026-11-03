from tests.stories.core.modules.memories.fading_at_compaction import compacted
from tests.stories.core.modules.memories.support.round_checks import expect_browser_round, expect_faded_mark_count, expect_round
from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.server.support.server_client import server_story
from tests.stories.fixtures.permanent_memory_type import PermanentMemoryType


def test_the_round_and_browser_count_only_memories_changed_by_this_compaction(new_story):
    story = new_story(fixture=PermanentMemoryType)
    permanent = story.new_row_id('memory make "Project conventions" --type project --weight 0 --environment main')
    project = story.new_row_id('memory make "Shared project context" --type fact --weight 0 --project')
    prior_round = story.new_row_id('memory make "An earlier round faded this" --type fact --weight 0 --environment main')
    shown = story.new_row_id('memory make "The cart stores cents" --type fact --weight 2 --environment main')
    faded = story.new_row_id('memory make "The last temporary detail" --type fact --weight 1 --environment main')
    compacted(story)
    mark = expect_round(story, [(shown, 2, 1)], [(faded, 1, 0)], [permanent, project, prior_round])
    story.expect_success("setting set journal.core.viewer.tour-completed true --project")
    with server_story(story) as server:
        expect_browser_round(server, mark.id, [shown], [faded], [permanent, project, prior_round])


def test_a_permanent_memory_at_zero_does_not_make_a_removed_round(new_story):
    story = new_story(fixture=PermanentMemoryType)
    story.expect_success('memory make "Project conventions" --type project --weight 0 --environment main')
    compacted(story)
    expect_faded_mark_count(story, 0)


def test_an_already_faded_memory_is_not_reported_again_at_the_next_compaction(new_story):
    story = new_story(fixture=BuilderStarted)
    memory = story.new_row_id('memory make "One temporary detail" --type fact --weight 1 --environment main')
    compacted(story)
    expect_round(story, [], [(memory, 1, 0)], [])
    compacted(story)
    expect_faded_mark_count(story, 1)
