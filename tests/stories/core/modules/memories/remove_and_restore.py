from tests.stories.core.support.fixtures import UserJoined

FACT_COMMAND = 'memory make "The cart total is in cents" --type fact --environment main'


def test_a_removed_memory_keeps_its_row_with_the_reason(new_story):
    story = new_story(fixture=UserJoined)
    memory_id = story.new_row_id(FACT_COMMAND, actor=story.agent)
    story.expect_success(f'memory remove {memory_id} --reason "the cart moved to whole euros"', "state: removed", "reason: the cart moved to whole euros", actor=story.agent)


def test_a_restored_memory_stands_again(new_story):
    story = new_story(fixture=UserJoined)
    memory_id = story.new_row_id(FACT_COMMAND, actor=story.agent)
    story.expect_success(f'memory remove {memory_id} --reason "wrong"', actor=story.agent)
    story.expect_success(f"memory restore {memory_id}", "state: active", actor=story.agent)
