from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.coding_fixtures import BuilderWithOpenTask

TASK_FACT = 'memory make "The cart test needs the euro fixture" --type fact --task 1 --environment main'


def test_a_memory_of_a_cancelled_task_is_removed(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    memory_id = story.new_row_id(TASK_FACT, actor=story.agent)
    story.run(lines.TASK_CANCEL)
    story.run_listeners()
    story.expect_success(f"memory show {memory_id}", "state: removed")


def test_a_memory_of_an_open_task_stays(new_story):
    story = new_story(fixture=BuilderWithOpenTask)
    memory_id = story.new_row_id(TASK_FACT, actor=story.agent)
    story.run_listeners()
    story.expect_success(f"memory show {memory_id}", "state: active")
