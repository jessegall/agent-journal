from tests.stories.core.modules.plans.support.started_plans import ThreeStartedPlans
from tests.stories.suites.coding.support.hand_outs import next_task_id, outside_task


def test_b1_f3_a_critical_task_outside_any_plan_goes_before_the_focus_whatever_plan_is_focused(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    fire = outside_task(story, "Fire", "--priority critical")
    story.expect_rows(next_task_id(story) == fire)


def test_b2_a_task_the_agent_was_told_to_take_goes_before_the_focus(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    story.expect_success("task next 2", actor=story.agent)
    story.expect_rows(next_task_id(story) == 2)


def test_b3_a_reserved_task_of_the_focus_is_taken_at_the_focus_and_a_reserved_task_outside_it_stays_last(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    later = outside_task(story, "Later job")
    for task_id in (later, 6):
        story.expect_success(f"task assign {task_id} --to {story.agent.id}", actor=story.agent)
    story.run("task edit 6 --priority high", actor=story.user)
    story.run("plan focus 3", actor=story.agent)
    story.expect_rows(next_task_id(story) == 6, next_task_id(story, 6) == 5)


def test_b13_a_focus_with_nothing_to_take_gives_way_to_the_oldest_started_plan_and_then_to_a_task_outside_the_plans(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    for task_id in (5, 6):
        story.run(f'task block {task_id} --until-user --reason "Ada decides"', actor=story.user)
    story.expect_rows(next_task_id(story) == 1)
    loose = outside_task(story, "Loose job")
    for task_id in (1, 2, 3, 4):
        story.run(f'task block {task_id} --until-user --reason "Ada decides"', actor=story.user)
    story.expect_rows(next_task_id(story) == loose)


def test_b15_closing_a_task_of_another_plan_starts_the_next_task_of_the_focus(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_success('task close 1 --outcome "done"', actor=story.agent)
    story.run_listeners()
    story.expect_success("task show 5", "state: started", actor=story.agent)
    story.expect_success("task show 2", "state: open", actor=story.agent)


def test_b16_a_task_that_waits_on_a_task_the_same_agent_has_started_is_not_kept_back(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    for task_id in (1, 2):
        story.expect_success(f"task assign {task_id} --to {story.agent.id}", actor=story.agent)
    story.run("task depend 2 --on 1", actor=story.user)
    story.expect_success("task start 1", actor=story.agent)
    story.expect_rows(next_task_id(story) == 2)


def test_b18_a_task_the_agent_released_just_now_is_not_handed_to_it_again(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_rows(next_task_id(story, 1) == 2)


def test_c1_a13_a_task_of_a_plan_nobody_approved_is_not_handed_out_and_once_approved_and_focused_its_first_task_starts_the_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run('plan make "Yard" --environment main', actor=story.user)
    story.expect_success('phase make --plan 4 "Build"', actor=story.user)
    fence = outside_task(story, "Yard fence")
    story.run(f"phase place {fence} --phase 4", actor=story.user)
    story.run(f"task depend 2 --on {fence}", actor=story.user)
    story.expect_success("plan focus", f"it waits on task {fence}, which is in plan 4, a plan nobody approved", actor=story.agent)
    story.run(f'task waits-on-nothing {fence} --why "the order does not matter in this story"', actor=story.user)
    story.run('plan ready 4 --environment main --skip-guard plans.one-task-phase --skip-reason "one task is enough in this story"', actor=story.user)
    story.run("plan approve 4 --environment main", actor=story.user)
    story.run("plan focus 4", actor=story.agent)
    story.expect_rows(next_task_id(story) == fence)
    story.expect_success(f"task start {fence}", actor=story.agent)
    story.run_listeners()
    story.expect_success("plan show 4", "state: started")
