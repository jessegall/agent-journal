import pytest

from suites.coding.support.shipped_profiles import HELPER_PROFILES
from tests.stories.support.story_checks import expect_value
from suites.coding.support.shipped_profiles import PLANNER_PROFILE
from suites.coding.support.shipped_profiles import PLAN_REVIEWER_PROFILE

BODIES = {profile.name: profile.body for profile in HELPER_PROFILES}
RULES_FOR_HANDING_OUT_WORK = ("journal worker send", "journal helper send", "journal agent retire", "Running limits", "kept limits")


def test_a_planner_still_writes_story_books_and_states_what_each_task_waits_on():
    expect_value("story books" in BODIES[f"{PLANNER_PROFILE.name}"], True)
    expect_value("state what every task waits on" in BODIES[f"{PLANNER_PROFILE.name}"], True)
