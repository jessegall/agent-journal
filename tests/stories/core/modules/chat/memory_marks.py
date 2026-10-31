from tests.stories.core.modules.chat.support.mark_samples import mark_count
from tests.stories.core.support.fixtures import UserJoined

MEMORY_LINE = 'memory make "Fact" --type fact --weight 3 --environment main'


def test_a_memory_weighed_shows_one_mark_written_by_the_listener_after_the_commit(new_story):
    story = new_story(fixture=UserJoined)
    memory_id = story.new_row_id(MEMORY_LINE, actor=story.agent)
    story.expect_success(f"memory weigh {memory_id} 7", actor=story.agent)
    assert mark_count(story) == 0
    story.run_listeners()
    assert mark_count(story) == 1
    story.expect_success("chat-mark list --environment main", f"Memory {memory_id}: weight set to 7")


def test_a_failed_command_writes_no_mark(new_story):
    story = new_story(fixture=UserJoined)
    first = story.new_row_id(MEMORY_LINE, actor=story.agent)
    story.expect_refusal(f"memory weigh {first},{first} 4,5,6", "2 memories and 3 weights", actor=story.agent)
    story.run_listeners()
    assert mark_count(story) == 0
