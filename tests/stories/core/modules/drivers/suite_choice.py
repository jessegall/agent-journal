from tests.stories.core.base.drivers.support.fixtures import LeadStarted
from tests.stories.core.base.drivers.support.samples import SAMPLES
from tests.stories.core.support.fixtures import MainEnvironment


def test_with_several_top_suites_installed_none_runs_until_one_is_chosen(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.expect_success("suite current main", "suite: none, choose one with journal suite choose control or samples")


def test_choosing_a_suite_no_module_ships_is_refused_naming_the_installed_ones(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.expect_refusal("suite choose marketing --environment main", "no installed module ships suite marketing: control or samples")


def test_a_chosen_suite_runs_in_its_environment_and_gives_each_role_its_default_driver(new_story):
    story = new_story(SAMPLES, fixture=MainEnvironment)
    story.run("suite choose samples --environment main")
    story.expect_success("suite current main", "suite: samples", "drivers: main: samples.lead")


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
