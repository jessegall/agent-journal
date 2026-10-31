from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import TaskWaitingOnSecond


def test_a_task_that_waits_on_an_open_task_cannot_start_and_is_told_how_to_stop_waiting(new_story):
    story = new_story(fixture=TaskWaitingOnSecond)
    story.expect_refusal(lines.TASK_START, "task 1 waits on open task 2", actor=story.agent)
    story.expect_text(lines.TASK_DETAILS, "state: open")


def test_a_task_starts_once_the_task_it_waits_on_is_completed(new_story):
    story = new_story(fixture=TaskWaitingOnSecond)
    story.run(lines.SECOND_TASK_START, actor=story.agent)
    story.run('task close 2 --outcome "done"', actor=story.agent)
    story.expect_success(lines.TASK_START, "state: started", actor=story.agent)


def test_a_task_starts_once_the_task_it_waits_on_is_cancelled(new_story):
    story = new_story(fixture=TaskWaitingOnSecond)
    story.run('task cancel 2 --reason "not needed"')
    story.expect_success(lines.TASK_START, "state: started", actor=story.agent)
