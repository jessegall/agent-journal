from core.modules.tasks.models.task import Task
import json

from tests.stories.core.support.fixtures import ThreeTasksPhase, PhasesPlan


def test_a_new_task_is_appended_to_its_phase_in_one_command(new_story):
    story = new_story(fixture=ThreeTasksPhase)
    story.expect_success('task make "Fourth" --phase 1 --brief "Keep the order" --priority high --environment main',
                         "title: Fourth", "brief: Keep the order", "priority: high")
    outline = json.loads(story.run("plan outline 1 --json").output_text)
    expect_title_task_tasks("Fourth", outline)
    story.expect_text("phase-task list --phase 1", "4  1  4  4")


def test_a_missing_phase_refuses_the_command_without_leaving_a_task(new_story):
    story = new_story(fixture=PhasesPlan)
    story.expect_refusal('task make "Unplaced" --phase 999 --environment main', "phase 999")
    story.expect_rows(story.story_rows(Task) == ())


def test_a_cancelled_plan_refuses_a_new_task_in_its_phase(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run('plan cancel 1 --reason "Replaced"')
    story.expect_refusal('task make "Too late" --phase 1 --environment main', "plan 1 is cancelled")
    story.expect_rows(story.story_rows(Task) == ())


def test_a_completed_plan_refuses_a_new_task_in_its_phase(new_story):
    story = new_story(fixture=PhasesPlan)
    story.run("plan ready 1")
    story.run("plan approve 1 --environment main", actor=story.user)
    story.run("plan close 1")
    story.expect_refusal('task make "Too late" --phase 1 --environment main', "plan 1 is completed")
    story.expect_rows(story.story_rows(Task) == ())


def expect_title_task_tasks(text, outline) -> None:
    actual = any((task['title'] == text for task in outline['phases'][0]['tasks']))
    assert actual, actual
