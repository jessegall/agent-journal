from tests.stories.core.support.fixtures import UserJoined


def facts(story) -> list[int]:
    return [story.new_row_id(f'memory make "Fact {number}" --type fact --weight 3 --environment main', actor=story.agent) for number in (1, 2, 3)]


def test_one_weight_given_for_several_memories_goes_to_all_of_them(new_story):
    story = new_story(fixture=UserJoined)
    ids = facts(story)
    story.expect_success(f"memory weigh {','.join(map(str, ids))} 7", actor=story.agent)
    for memory_id in ids:
        story.expect_success(f"memory show {memory_id}", "weight: 7", actor=story.agent)


def test_each_memory_takes_its_own_weight(new_story):
    story = new_story(fixture=UserJoined)
    first, second, third = facts(story)
    story.expect_success(f"memory weigh {first},{second},{third} 4,5,6", actor=story.agent)
    story.expect_success(f"memory show {third}", "weight: 6", actor=story.agent)


def test_a_count_of_weights_that_matches_neither_one_nor_each_is_refused(new_story):
    story = new_story(fixture=UserJoined)
    first, second, third = facts(story)
    story.expect_refusal(f"memory weigh {first},{second},{third} 4,5", "3 memories and 2 weights", actor=story.agent)
