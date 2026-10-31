from tests.stories.core.support import story_lines as lines
from tests.stories.core.support.fixtures import PlanTasksPlaced
from tests.stories.server.support.server_client import server_story

SESSION = "s-1"


def started_plan(new_story):
    story = new_story(fixture=PlanTasksPlaced)
    for move in ("ready", "approve", "start"):
        story.run(f"plan {move} 1")
    story.run(lines.TASK_START, actor=story.agent)
    return story


def test_a_write_through_the_server_wakes_the_listener_thread_which_starts_the_next_plan_task(new_story):
    with server_story(started_plan(new_story)) as story:
        story.run_as(lines.TASK_CLOSE, SESSION)
        story.expect_eventually("task show 2", "state: started")


def test_no_request_thread_runs_a_commit_listener(new_story):
    with server_story(started_plan(new_story), listener_thread_started=False) as story:
        story.run_as(lines.TASK_CLOSE, SESSION)
        story.expect_line("task show 1", "state: completed")
        story.expect_line("task show 2", "state: open")
