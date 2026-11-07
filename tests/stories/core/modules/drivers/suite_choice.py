from tests.stories.core.support import story_lines as lines
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.core.support.fixtures import MainEnvironment
from server.viewer.windows_route import WindowsRoute
from tests.stories.core.modules.drivers.support.extended_suites import PATH


def test_installing_several_suites_keeps_the_shipped_suite_as_default(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.expect_success(lines.CURRENT_SUITE, "suite: coding")


def test_choosing_a_suite_no_module_ships_is_refused_naming_the_installed_ones(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.expect_refusal("suite choose marketing --environment main", "no installed module ships suite marketing: coding or control or samples")


def test_a_chosen_suite_runs_in_its_environment_and_gives_each_role_its_default_driver(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.run("suite choose samples --environment main")
    story.expect_success(lines.CURRENT_SUITE, "suite: samples", "drivers: main: samples.lead")


def test_suite_show_names_its_defaults_and_the_overlays_it_includes(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.expect_success("suite show control", "complete_control: True", "includes: samples.edit-lock", "drivers: main: control.lead")


def test_choosing_a_driver_of_no_installed_module_or_of_another_suite_is_refused(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.run("suite choose samples --environment main")
    story.expect_refusal("driver choose samples.writer --environment main", "no installed module ships driver samples.writer")
    story.expect_refusal("driver choose control.lead --environment main", "driver control.lead belongs to suite control, and this environment runs samples")


def test_a_suite_change_sends_each_open_agent_its_new_drivers_opening_lines(new_story):
    story = new_story(SAMPLES, fixture=LeadStarted)
    story.run("suite choose control --environment main")
    story.expect_text(f"agent-line list --agent {story.agent.id}", "You are the control lead")


def test_the_installed_top_suites_are_listed_one_per_line_for_the_boot_menu(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.expect_success("suite list", "coding", "control", "samples")


def test_installing_a_suite_that_requires_coding_keeps_the_environment_on_coding(new_story):
    story = new_story(fixture=MainEnvironment)
    story.expect_sync_success(f"{PATH}:AcmeModule")
    story.expect_success(lines.CURRENT_SUITE, "suite: coding")


def test_two_suites_that_require_coding_leave_its_windows_available(new_story):
    story = new_story(f"{PATH}:AcmeModule", fixture=MainEnvironment)
    coding_windows = {window.name for window in WindowsRoute(story.home).windows("main")}
    story.expect_sync_success(f"{PATH}:AuditModule")
    story.expect_success(lines.CURRENT_SUITE, "suite: coding")
    story.expect_rows(bool(coding_windows),
                      {window.name for window in WindowsRoute(story.home).windows("main")} == coding_windows)


def test_an_explicit_setting_chooses_a_third_party_suite(new_story):
    story = new_story(f"{PATH}:AcmeModule", fixture=MainEnvironment)
    story.run("suite choose acme --environment main")
    story.expect_success(lines.CURRENT_SUITE, "suite: acme")
