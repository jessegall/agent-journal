from tests.stories.core.support.coding_fixtures import BuilderStarted
from tests.stories.core.support.fixtures import PlanFirstTaskClosed
from tests.stories.core.support import story_lines as lines
from tests.stories.core.modules.tasks.task_lifecycle import started_story


def test_a_plan_is_made_as_a_draft_in_the_callers_environment(new_story):
    story = started_story(new_story)
    story.expect_success('plan make "Version 5 core" --brief "the core and its modules" --environment main', "state: draft", "environment_id: 1")


def test_a_plan_moves_from_draft_to_completed(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.expect_success("plan ready 1", "state: ready")
    story.expect_success("plan approve 1", "state: approved")
    story.expect_success("plan start 1", "state: started", actor=story.agent)
    story.expect_success('plan block 1 --reason "waits on a decision"', "state: blocked", actor=story.agent)
    story.expect_success("plan unblock 1", "state: started", actor=story.agent)
    story.expect_success("plan close 1", "state: completed", "closed_at: 2026-10-31T09:00:00.000000+00:00", actor=story.agent)


def test_a_plan_is_cancelled_with_its_reason(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.expect_success(lines.PLAN_CANCEL, "state: cancelled", "reason: replaced")


def test_a_move_out_of_a_wrong_state_is_refused_with_the_moves_that_go_on(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.expect_refusal("plan start 1", "from draft it can only go on with journal plan ready 1, journal plan cancel 1")
    story.expect_refusal("plan approve 1", "plan 1 is draft, so it cannot approve")


def test_a_plan_has_no_pause(new_story):
    story = started_story(new_story)
    story.run(lines.NEW_PLAN)
    story.expect_usage_error('plan pause 1 --reason "the user asked"')



def test_a_plan_with_open_tasks_is_not_closed_and_points_to_its_progress(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.expect_refusal("plan close 1", "plan 1 has 2 tasks still open: see them with journal plan progress 1", actor=story.agent)


def test_a_plan_closes_by_itself_when_its_last_task_ends(new_story):
    story = new_story(fixture=PlanFirstTaskClosed)
    story.run('task close 3 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_success("plan show 1", "state: started", actor=story.agent)
    story.run(lines.TASK_CANCEL)
    story.run_listeners()
    story.expect_success("plan show 1", "state: completed", actor=story.agent)


def test_a_plan_is_cancelled_by_itself_when_every_task_is_cancelled(new_story):
    story = new_story(fixture=BuilderStarted)
    story.run('plan make "The rebuild" --brief "all of it" --environment main', actor=story.agent)
    story.run('phase make --plan 1 "First" --goal "it works"', actor=story.agent)
    story.run('task make "Only task" --environment main', actor=story.agent)
    story.run("phase place 1 --phase 1", actor=story.agent)
    for move in ("plan ready 1", "plan approve 1", "plan start 1"):
        story.run(move)
    story.run('task cancel 1 --reason "not needed"', actor=story.agent)
    story.run_listeners()
    story.expect_success("plan show 1", "state: cancelled", actor=story.agent)
