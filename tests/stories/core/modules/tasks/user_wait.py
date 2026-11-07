from tests.stories.core.support.fixtures import UserJoined


def test_a_task_blocked_until_the_user_acts_is_opened_only_by_a_person(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Publish it" --environment main', actor=story.agent)
    story.expect_refusal("task block 1 --until-user", "say what the user must do", actor=story.agent)
    story.expect_success('task block 1 --until-user --reason "Publish the release"', actor=story.agent)
    story.expect_refusal("task unblock 1", "task 1 waits on the user", actor=story.agent)
    story.expect_success("task unblock 1", actor=story.user)
    story.expect_text("task show 1", "state: open", actor=story.user)
