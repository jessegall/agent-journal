from tests.stories.core.support.fixtures import UserJoined


def test_the_board_brings_each_going_group_in_one_answer_and_only_the_count_of_the_finished(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task cancel 2 --reason "not needed"', actor=story.agent)
    story.expect_text("task board --environment main", "open: 1", "cancelled: 1", actor=story.user)
    answer = story.run("task board --environment main --json", actor=story.user).output_text
    assert "Fix the cart" in answer and "Fix the totals" not in answer


def test_one_state_can_be_read_a_page_at_a_time(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    assert "Fix the totals" in story.run("task board --environment main --state cancelled --json", actor=story.user).output_text


def test_the_board_holds_only_the_fields_a_card_draws_never_a_brief(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --brief "Long words about the cart" --environment main', actor=story.agent)
    answer = story.run("task board --environment main --json", actor=story.user).output_text
    assert "Fix the cart" in answer and "Long words" not in answer
