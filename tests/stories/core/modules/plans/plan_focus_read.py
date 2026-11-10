from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.stories.core.modules.plans.support.started_plans import (
    DEFAULT_FOCUS,
    PLAN_FOCUS,
    OldestPlanWaitsOnAPerson,
    OldestPlanWaitsOutside,
    ThreeStartedPlans,
)


def test_a1_with_three_started_plans_and_no_word_the_focus_is_the_oldest_started_plan_with_work(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=story.agent)


def test_a2_a_started_plan_whose_tasks_all_wait_on_a_task_nobody_can_take_is_passed_over(new_story):
    story = new_story(fixture=OldestPlanWaitsOnAPerson)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "plan 1: waits on task 7, which waits on a person", actor=story.agent)


def test_a3_a_started_plan_that_waits_on_an_outside_task_the_agent_can_take_is_workable_and_the_default(new_story):
    story = new_story(fixture=OldestPlanWaitsOutside)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", "task 7 holds back 2 tasks of plan 1: you can take it", actor=story.agent)


def test_a6_plan_focus_with_no_number_prints_the_focus_says_which_and_lists_the_other_started_plans(new_story):
    story = new_story(fixture=OldestPlanWaitsOnAPerson)
    story.run("task start 5", actor=story.agent)
    story.run("task depend 6 --on 5", actor=story.user)
    story.expect_success(PLAN_FOCUS, f"plan 2 is your focus: {DEFAULT_FOCUS}", "other started plans:",
                         "plan 1: waits on task 7, which waits on a person", "plan 3: waits on task 5, which you hold", actor=story.agent)
    answer = story.run(PLAN_FOCUS, actor=story.agent).output_text
    story.expect_rows("you set it" not in answer, detail=answer)


def test_a16_a_new_main_agent_in_a_new_session_starts_on_the_default_and_is_told_so(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    later_agent = Actor(story.new_row_id("agent start s-2 claude main --environment main"), ActorType.AGENT)
    story.expect_success(PLAN_FOCUS, f"plan 1 is your focus: {DEFAULT_FOCUS}", actor=later_agent)


def test_closing_a_task_of_a_started_plan_still_starts_the_next_task_of_that_plan(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("task start 1", actor=story.agent)
    story.run('task close 1 --outcome "done"', actor=story.agent)
    story.expect_success("task show 2", "state: started", f"holder_id: {story.agent.id}")
    story.expect_success("task show 3", "state: open")
