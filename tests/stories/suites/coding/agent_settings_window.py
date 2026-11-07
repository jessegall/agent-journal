from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, person_viewer
from tests.stories.support.story_checks import expect_value

AUTO_MODE = "journal.suites.coding.auto-mode"


def test_s49_fixture_person_changes_a_control_through_the_viewer_line_route_and_reads_it_back(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        viewer.set_setting(AUTO_MODE, "false")
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, False))


def test_s45_fixture_a_refused_agent_write_leaves_the_value_the_person_sees(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_refusal(f"setting set {AUTO_MODE} off --environment main", "only a person changes", actor=story.agent)
    with person_viewer(story) as viewer:
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, True))


def test_s01_fixture_a_person_change_in_one_story_is_not_seen_by_the_next(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting set {AUTO_MODE} off --environment main", actor=story.user)


def test_s01_fixture_a_story_starts_from_the_declared_default_of_auto_mode(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting show {AUTO_MODE} --environment main", "value: True", actor=story.user)
