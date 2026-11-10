from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS
from tests.stories.suites.coding.support.focus_plans import two_started_plans_and_a_worker

SET_FOCUS = "plan {plan} is your focus: you set it"


def test_w2_w12_a_worker_sets_its_own_focus_and_a_person_sets_the_main_agents_and_neither_changes_the_other(new_story):
    story, worker, _ = two_started_plans_and_a_worker(new_story)
    story.expect_success("plan focus 2", SET_FOCUS.format(plan=2), actor=worker)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=story.agent)
    story.expect_success("plan focus 1 --environment main", "the focus of the main agent:", SET_FOCUS.format(plan=1), actor=story.user)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=2), actor=worker)
    story.expect_success("plan focus --clear", "your focus is the default again", actor=worker)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=1), actor=story.agent)
