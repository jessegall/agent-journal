from core.tasks.task import Task, TaskState
from tests.stories.plugins.samples import Review, ReviewState
from tests.stories.tasks.task_lifecycle import started_story

REVIEWS = "tests.stories.plugins.samples:ReviewsModule"


def reviewed_task_story(new_story):
    story = started_story(lambda: new_story(REVIEWS))
    story.run('task make "Fix the cart" --environment main')
    story.run("task start 1", actor=story.agent)
    story.run("review make 1")
    return story


def test_a_task_waits_for_its_review_before_it_closes(new_story):
    story = reviewed_task_story(new_story)
    story.expect_refusal('task close 1 --outcome "done"', "refused by reviews.task-closes-after-its-review: task 1 waits for its review", actor=story.agent)
    story.expect_success("review passed 1", "state: passed")
    story.expect_success('task close 1 --outcome "done"', "state: completed", actor=story.agent)
    story.expect_rows(story.row(Task, 1).state is TaskState.COMPLETED, story.row(Review, 1).state is ReviewState.PASSED)


def test_a_failed_review_takes_its_note_and_the_refusal_is_recorded(new_story):
    story = reviewed_task_story(new_story)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_success('review failed 1 --note "the total is still wrong"', "state: failed", "note: the total is still wrong")
    story.expect_rows([refusal.guard for refusal in story.refusals()] == ["reviews.task-closes-after-its-review"])
