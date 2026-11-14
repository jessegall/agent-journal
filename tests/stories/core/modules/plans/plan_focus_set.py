import pytest

from tests.stories.core.modules.plans.support.started_plans import DEFAULT_FOCUS, PLAN_FOCUS, ThreeStartedPlans

SET_FOCUS = "plan {plan} is your focus: you set it"
DEFAULT_ON_FIRST_PLAN = f"plan 1 is your focus: {DEFAULT_FOCUS}"
MISSING_PLAN_REFUSAL = "no such plan"


def test_a4_a5_naming_a_plan_sets_the_focus_and_naming_another_replaces_it_with_nothing_kept_of_the_first(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success("plan focus 2", SET_FOCUS.format(plan=2), actor=story.agent)
    story.expect_success("plan focus 3", SET_FOCUS.format(plan=3), actor=story.agent)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=3), "plan 2: has work you can take", actor=story.agent)


def test_a7_clearing_the_focus_brings_the_default_back_and_says_so(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 3", actor=story.agent)
    story.expect_success("plan focus --clear", "your focus is the default again", DEFAULT_ON_FIRST_PLAN, actor=story.agent)
    story.expect_success(PLAN_FOCUS, DEFAULT_ON_FIRST_PLAN, actor=story.agent)


@pytest.mark.parametrize("ready_line, reason", [
    ("", "plan 4 is a draft: a user must approve it first"),
    ("plan block 3 --reason \"the supplier is late\"", "plan 3 is blocked: focus a started or an approved plan"),
    ("plan cancel 3 --reason \"replaced\"", "plan 3 is cancelled: focus a started or an approved plan"),
], ids=["draft", "blocked", "cancelled"])
def test_a8_a9_a_plan_that_is_not_approved_or_has_ended_or_is_blocked_is_refused_and_the_focus_stays(new_story, ready_line, reason):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("plan focus 2", actor=story.agent)
    story.run('plan make "Yard" --environment main', actor=story.user)
    if ready_line:
        story.run(f"{ready_line} --environment main", actor=story.user)
    story.expect_refusal(f"plan focus {reason.split()[1]}", reason, actor=story.agent)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=2), actor=story.agent)


def test_a10_a_number_that_is_no_plan_and_a_plan_of_another_environment_are_refused_with_the_same_words(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.run("environment make shop /work/shop")
    story.run('plan make "Shop front" --environment shop', actor=story.user)
    for plan_id in (99, 4):
        story.expect_refusal(f"plan focus {plan_id}", MISSING_PLAN_REFUSAL, actor=story.agent)
    story.expect_success(PLAN_FOCUS, DEFAULT_ON_FIRST_PLAN, actor=story.agent)


def test_a12_a_person_who_names_a_plan_sets_the_focus_of_the_running_main_agent(new_story):
    story = new_story(fixture=ThreeStartedPlans)
    story.expect_success("plan focus 2 --environment main", "the focus of the main agent:", SET_FOCUS.format(plan=2), actor=story.user)
    story.expect_success(PLAN_FOCUS, SET_FOCUS.format(plan=2), actor=story.agent)
