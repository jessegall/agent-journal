import json

from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from core.testing.expect_row import expect_row
from tests.stories.support.story_checks import expect_value


def inspected(story, task_id):
    return json.loads(story.run(f"task inspect {task_id} --json", actor=story.user).output_text)


def test_the_inspector_reads_a_task_with_what_it_waits_on_and_its_log_in_one_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main --brief "The total adds up"', actor=story.agent)
    story.run('task make "Fix the totals" --environment main', actor=story.agent)
    story.run("task-dependency make 1 2", actor=story.agent)
    story.run('task log 1 "Found the rounding"', actor=story.agent)
    story.run('task log 1 "Wrote the test"', actor=story.agent)
    answer = inspected(story, 1)
    expect_row(answer, title="Fix the cart", brief="The total adds up", state="blocked", priority=200)
    expect_row(answer, waits=[{"id": 2, "title": "Fix the totals", "state": "open"}])
    expect_log_logs_answer(answer, ["Found the rounding", "Wrote the test"])


def test_the_inspector_shows_why_a_task_stopped_and_how_it_ended(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run('task block 1 --reason "Waiting on the supplier"', actor=story.agent)
    expect_row(inspected(story, 1), reason="Waiting on the supplier")
    story.run("task unblock 1", actor=story.agent)
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "Rounded at the end"', actor=story.agent)
    expect_row(inspected(story, 1), outcome="Rounded at the end")


def test_a_tasks_place_names_its_plan_and_phase(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "Checkout" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "First"', actor=story.agent)
    story.run('phase make --plan 1 "Second"', actor=story.agent)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run("phase place 1 --phase 2", actor=story.agent)
    place = json.loads(story.run("plan place 1 --json", actor=story.user).output_text)
    expect_value(place, {"plan_id": 1, "plan_title": "Checkout", "phase_number": 2, "phase_total": 2, "phase_title": "Second"})


def test_a_task_in_no_plan_has_no_place(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    expect_row(json.loads(story.run("plan place 1 --json", actor=story.user).output_text), plan_id=0)


def test_the_plan_inspector_reads_a_plan_with_its_phases_and_how_far_it_has_come_in_one_answer(new_story):
    story = new_story(fixture=UserJoined)
    story.run('plan make "Checkout" --environment main --brief "Why it moves"', actor=story.agent)
    story.run('phase make --plan 1 "First"', actor=story.agent)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    story.run("phase place 1 --phase 1", actor=story.agent)
    answer = json.loads(story.run("plan inspect 1 --json", actor=story.user).output_text)
    expect_row(answer, title="Checkout", brief="Why it moves", state="draft", total=1, finished=0, current_phase=0)
    expect_row(answer["phases"][0], title="First")
    expect_row(answer["phases"][0]["tasks"][0], title="Fix the cart")


def test_the_tasks_window_and_the_shell_may_read_and_change_a_task(new_story):
    window = WindowStory(new_story(fixture=UserJoined))
    window.expect_window_allowed("tasks.tasks", "task inspect 1")
    window.expect_window_allowed("tasks.tasks", "plan place 1")
    window.expect_window_allowed("tasks.tasks", 'task make "Fix the cart"')
    window.expect_window_allowed("tasks.tasks", "task edit 1 --priority high")
    window.expect_window_allowed("tasks.tasks", "task start 1")
    window.expect_window_allowed("viewer.shell", "task inspect 1")
    window.expect_window_allowed("viewer.shell", "plan place 1")
    window.expect_window_allowed("viewer.shell", "plan inspect 1")
    window.expect_window_allowed("viewer.shell", "task edit 1 --priority high")


def expect_log_logs_answer(answer, expected) -> None:
    actual = [log['line'] for log in answer['logs']]
    assert actual == expected, actual
