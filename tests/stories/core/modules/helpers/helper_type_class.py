from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.fixtures import MainEnvironment

SAMPLES = "tests.stories.core.modules.helpers.support.helper_type_samples"


def test_a_suite_that_adds_one_helper_type_as_one_class_can_start_it_with_its_own_driver(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ScribeSuite")
    story.expect_registered_helper_type("scribe", label="Scribe", access="read-only", bases=["helper"])
    story.expect_text("suite show scribe", "scribe: scribe.scribe", actor=story.user)
    story.expect_helper_type_behaviours("scribe", takes_marks=True, takes_tasks=False)
    story.expect_success("agent start scribe-session claude scribe --environment main", "role: scribe")


def test_two_suites_that_register_the_same_helper_type_stop_the_boot_naming_both(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:ScribeSuite")
    story.expect_sync_refusal(f"{SAMPLES}:CopyScribeSuite", "suite copy-scribe and suite scribe both register helper type scribe")
    story.expect_sync_without(f"{SAMPLES}:CopyScribeSuite")
    story.expect_text("suite show scribe", "scribe: scribe.scribe", actor=story.user)


def test_an_ended_agent_of_a_type_no_module_registers_any_more_is_shown_retired_with_its_stored_key(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{SAMPLES}:RetiringModule")
    scribe = story.new_row_id("agent start scribe-session claude scribe --environment main")
    story.expect_success(f"agent end {scribe}", actor=story.user)
    story.expect_sync_without(f"{SAMPLES}:RetiringModule")
    story.expect_text(f"agent show {agent_number(story, scribe)}", "role: scribe", actor=story.user)
    story.expect_text("agent cards --show retired", "scribe-session  scribe", "  retired  ended", actor=story.user)
