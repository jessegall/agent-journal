from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS, ThreeStartedPlans

DEFAULT_ON_FIRST_PLAN = f"plan 1 is your focus: {DEFAULT_FOCUS}"
UNUSED_FOCUS = "your focus on plan 3 is not used: the plan is {state}"


def test_a14_a_focus_on_a_plan_that_is_completed_is_said_to_be_unused_and_the_default_is_named(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    for task_id in (5, 6):
        story.run(f"task start {task_id}", actor=story.agent)
        story.run(f'task close {task_id} --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_success("plan show 3", "state: completed")
    story.expect_success(PLAN_FOCUS, UNUSED_FOCUS.format(state="completed"), DEFAULT_ON_FIRST_PLAN, actor=story.agent)


def test_a15_a_focus_on_a_blocked_plan_is_not_used_and_counts_again_once_the_plan_is_started_again(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    story.run('plan block 3 --reason "the supplier is late" --environment main', actor=story.user)
    story.expect_success(PLAN_FOCUS, UNUSED_FOCUS.format(state="blocked"), DEFAULT_ON_FIRST_PLAN, actor=story.agent)
    story.run("plan unblock 3 --environment main", actor=story.user)
    story.expect_success(PLAN_FOCUS, "plan 3 is your focus: you set it", actor=story.agent)


def test_a_focus_on_a_cancelled_plan_is_not_used_and_the_default_is_read(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    story.run('plan cancel 3 --reason "replaced" --environment main', actor=story.user)
    story.expect_success(PLAN_FOCUS, UNUSED_FOCUS.format(state="cancelled"), DEFAULT_ON_FIRST_PLAN, actor=story.agent)
