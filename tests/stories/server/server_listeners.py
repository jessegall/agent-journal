from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import StartedPlanTask
from tests.stories.server.support.server_client import server_story

SESSION = "s-1"


def test_a_write_through_the_server_wakes_the_listener_thread_which_starts_the_next_plan_task(new_story):
    with server_story(new_story(fixture=StartedPlanTask)) as story:
        story.run_as(lines.TASK_CLOSE, SESSION)
        story.expect_eventually(lines.SECOND_TASK_DETAILS, "state: started")


def test_no_request_thread_runs_a_commit_listener(new_story):
    with server_story(new_story(fixture=StartedPlanTask), listener_thread_started=False) as story:
        story.run_as(lines.TASK_CLOSE, SESSION)
        story.expect_line(lines.TASK_DETAILS, "state: completed")
        story.expect_line(lines.SECOND_TASK_DETAILS, "state: open")
