import pytest

from suites.coding.support.shipped_profiles import HELPER_PROFILES
from tests.stories.support.story_checks import expect_value
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE

BODIES = {profile.name: profile.body for profile in HELPER_PROFILES}
RULES_FOR_HANDING_OUT_WORK = ("journal worker send", "journal helper send", "journal agent retire", "Running limits", "kept limits")


@pytest.mark.parametrize("profile", [f"{PLANNER_PROFILE.name}", f"{PLAN_REVIEWER_PROFILE.name}"])
@pytest.mark.parametrize("rule", RULES_FOR_HANDING_OUT_WORK)
def test_a_profile_that_only_writes_or_reviews_a_plan_has_no_rules_for_handing_out_work(profile, rule):
    expect_value(rule in BODIES[profile], False)


def test_a_planner_still_writes_story_books_and_states_what_each_task_waits_on():
    expect_value("story books" in BODIES[f"{PLANNER_PROFILE.name}"], True)
    expect_value("state what every task waits on" in BODIES[f"{PLANNER_PROFILE.name}"], True)
