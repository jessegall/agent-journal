from tests.stories.core.modules.plans.support.started_plans import OldestPlanWaitsOutside, ThreeStartedPlans
from tests.stories.suites.coding.support.hand_outs import next_task_id, outside_task, plan_task

SHOP_PHASE = 1


def test_b5_b6_a_task_other_plan_tasks_wait_on_goes_before_a_task_of_higher_priority_and_priority_decides_between_equals(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("task edit 1 --priority high", actor=story.user)
    story.expect_rows(next_task_id(story) == 1)
    for title in ("Shop shelves", "Shop till"):
        story.run(f"task depend {plan_task(story, title, SHOP_PHASE)} --on 2", actor=story.user)
    story.expect_rows(next_task_id(story) == 2)


def test_b7_a_later_phase_is_not_handed_out_while_the_working_phase_has_a_task(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success('phase make --plan 1 "Ship"', actor=story.user)
    plan_task(story, "Shop opening", 4, "--priority high")
    story.expect_rows(next_task_id(story) == 1)


def test_b9_an_open_task_outside_any_plan_that_the_focus_waits_on_goes_before_an_unrelated_open_task(new_story):
    story = new_story(fixture=OldestPlanWaitsOutside)
    outside_task(story, "Unrelated job", "--priority high")
    story.expect_rows(next_task_id(story) == 7)


def test_b10_a_task_of_another_started_plan_that_the_focus_waits_on_goes_before_the_next_task_of_that_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    for task_id in (1, 2):
        story.run(f"task depend {task_id} --on 4", actor=story.user)
    story.expect_rows(next_task_id(story) == 4)


def test_b11_of_a_chain_of_waits_the_task_at_its_end_is_handed_out(new_story):
    story = new_story(fixture=OldestPlanWaitsOutside)
    signature = outside_task(story, "Signature")
    story.run(f"task depend 7 --on {signature}", actor=story.user)
    story.expect_rows(next_task_id(story) == signature)


def test_b12_a_task_the_plan_waits_on_and_a_ready_plan_task_are_ranked_together_on_what_waits_on_them(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    contract = outside_task(story, "Supplier contract")
    story.run(f"task depend 1 --on {contract}", actor=story.user)
    story.expect_rows(next_task_id(story) == contract)
    for title in ("Shop shelves", "Shop till"):
        story.run(f"task depend {plan_task(story, title, SHOP_PHASE)} --on 2", actor=story.user)
    story.expect_rows(next_task_id(story) == 2)
