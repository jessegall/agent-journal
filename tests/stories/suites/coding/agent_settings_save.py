import pytest

from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, person_viewer
from tests.stories.suites.coding.support.settings_modal import AUTO, LONG_TABS, SENDS, TYPE_SCREENS, Modal
from tests.stories.support.story_checks import expect_value, expect_value_4



@pytest.fixture
def modal(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        yield story, Modal(viewer)


def test_one_change_on_work_and_one_on_tests_save_with_one_request_and_both_are_read_back(modal):
    _, screens = modal
    number = screens.first_of_kind("tests", "number")
    changed = int(number["value"]) + 1
    screens.save({AUTO: "off", number["key"]: str(changed)}, "work", "tests")
    expect_value((screens.value("work", AUTO), screens.value("tests", number["key"])), (False, changed))


def test_nothing_is_written_until_the_one_save_is_sent(modal):
    _, screens = modal
    number = screens.first_of_kind("tests", "number")
    before = (screens.value("work", AUTO), screens.value("tests", number["key"]), screens.revisions(*LONG_TABS))
    after = (screens.value("work", AUTO), screens.value("tests", number["key"]), screens.revisions(*LONG_TABS))
    expect_value(before, after)


def test_a_number_left_blank_is_refused_and_names_the_setting(modal):
    _, screens = modal
    number = screens.first_of_kind("tests", "number")
    screens.expect_refused({number["key"]: ""}, screens.revisions("tests"), number["key"])
    expect_value(screens.value("tests", number["key"]), number["value"])


def test_a_number_below_its_least_is_refused_with_the_rule_and_nothing_is_written(modal):
    _, screens = modal
    number = screens.first_of_kind("tests", "number")
    screens.expect_refused({AUTO: "off", number["key"]: "-1"}, screens.revisions("work", "tests"), "must be at least")
    expect_value((screens.value("work", AUTO), screens.value("tests", number["key"])), (True, number["value"]))


def test_the_settings_under_main_agent_sends_workers_declare_it_as_the_switch_they_need(modal):
    _, screens = modal
    under = sorted(key for name in LONG_TABS for key, node in screens.nodes(name).items() if SENDS in node["requires"])
    expect_value_4(len(under) >= 2)
    screens.save({SENDS: "off"}, "work")
    expect_value_4(screens.value("work", SENDS) is False)
    expect_value(sorted(key for name in LONG_TABS for key, node in screens.nodes(name).items() if SENDS in node["requires"]), under)


def test_one_refused_part_saves_none_of_the_request(modal):
    _, screens = modal
    number = screens.first_of_kind("tests", "number")
    screens.expect_refused({AUTO: "off", number["key"]: "not a number"}, screens.revisions("work", "tests"), number["key"])
    expect_value((screens.value("work", AUTO), screens.value("tests", number["key"])), (True, number["value"]))


def test_settings_changed_elsewhere_since_the_modal_opened_refuse_the_save_with_the_revision_reason(modal):
    story, screens = modal
    opened = screens.revisions("work", "tests")
    story.expect_success(f"setting set {AUTO} off --environment main", actor=story.user)
    story.expect_text("work-settings show --environment main", "workflow:", actor=story.user)
    number = screens.first_of_kind("tests", "number")
    screens.expect_refused({number["key"]: str(int(number["value"]) + 1)}, opened, "changed since you read them")
    expect_value(screens.value("tests", number["key"]), number["value"])
    screens.save({number["key"]: str(int(number["value"]) + 1)}, "tests")
    expect_value((screens.value("work", AUTO), screens.value("tests", number["key"])), (False, int(number["value"]) + 1))


def test_a_reader_that_is_not_a_person_sees_every_value_and_cannot_save(modal):
    story, screens = modal
    shown = screens.window_keys("work-screen,tests-screen,advanced-screen")
    expect_value_4(all(shown[key]["code"] == 0 and shown[key]["value"]["nodes"] for key in shown))
    revision = screens.screen("work")["revision"]
    story.expect_refusal(f"setting-screen apply work --revision {revision} {AUTO}=off --environment main --reason 'a story asks'", "A user was asked", actor=story.agent)
    expect_value_4(screens.value("work", AUTO) is True)


def test_the_two_switches_that_start_the_work_read_back_off_together(modal):
    _, screens = modal
    screens.save({AUTO: "off", SENDS: "off"}, "work")
    expect_value((screens.value("work", AUTO), screens.value("work", SENDS)), (False, False))


def test_each_setting_appears_once_across_the_screens_of_the_modal(modal):
    _, screens = modal
    keys = [node["key"] for name in (*LONG_TABS, *TYPE_SCREENS) for node in screens.screen(name)["nodes"]]
    expect_value(len(keys), len(set(keys)))
