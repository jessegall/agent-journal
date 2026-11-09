from suites.coding.support.shipped_profiles import HELPER_PROFILES
from tests.stories.support.story_checks import expect_value

DESIGNER_BODY = next(profile.body for profile in HELPER_PROFILES if profile.name == "journal-designer")


def test_a_designer_pins_its_finished_design_to_the_top_of_the_chat():
    expect_value("journal pin make" in DESIGNER_BODY, True)
