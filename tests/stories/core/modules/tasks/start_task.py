from tests.stories.core.support.fixtures import AssignedTask, OpenTask
from tests.stories.core.support import story_lines as lines
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def test_a_start_holds_the_task_for_the_caller_and_logs_the_change(new_story):
    story = new_story(fixture=OpenTask)
    story.expect_success(lines.TASK_START, "state: started", f"holder_id: {story.agent.id}", actor=story.agent)
    story.expect_text("event list --limit 5", "task.start", "StartTask")


def test_a_completed_task_cannot_start_and_the_refusal_names_the_way_on(new_story):
    story = new_story(fixture=AssignedTask)
    story.run(lines.TASK_CLOSE, actor=story.agent)
    story.expect_refusal(lines.TASK_START, "refused by core.lifecycle: task 1 is completed, so it cannot start: from completed it can only go on with journal task reopen 1")
