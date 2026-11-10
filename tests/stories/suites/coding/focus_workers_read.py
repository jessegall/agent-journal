from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS
from tests.stories.suites.coding.support.focus_plans import DEPOT_PHASES, two_started_plans_and_a_worker

SET_FOCUS = "plan {plan} is your focus: you set it"


def test_a_worker_and_the_main_agent_each_have_a_focus_of_their_own_by_default_and_when_one_is_named(new_story):
    story, worker, number = two_started_plans_and_a_worker(new_story)
    story.expect_success(f"plan assign 2 --phase {DEPOT_PHASES['Build']} --to {number} --environment main", actor=story.user)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "plan 1: has no task you can take", actor=worker)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=story.agent)
    story.expect_success("plan focus 1", SET_FOCUS.format(plan=1), actor=worker)
    story.expect_success("plan focus 2 --environment main", "the focus of the main agent:", SET_FOCUS.format(plan=2), actor=story.user)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=1), actor=worker)
    story.expect_success("plan focus --clear", "your focus is the default again", f"plan 2 is your focus: {DEFAULT_FOCUS}", actor=worker)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=2), actor=story.agent)
