from tests.stories.core.support.fixtures import UserJoined


def test_a_task_wait_can_be_reviewed_by_main_or_a_person(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Publish it" --environment main', actor=story.agent)
    story.expect_refusal("task block 1 --until-user", "say what the user must do", actor=story.agent)
    story.expect_success('task block 1 --until-user --reason "Publish the release"', actor=story.agent)
    story.expect_success("task unblock 1", actor=story.agent)
    story.expect_success('task block 1 --until-user --reason "Publish the release"', actor=story.agent)
    story.expect_success("task unblock 1", actor=story.user)
    story.expect_text("task show 1", "state: open", actor=story.user)
