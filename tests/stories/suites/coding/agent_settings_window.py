from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors, person_viewer
from tests.stories.support.story_checks import expect_value
from core.base.database.database import Database
from core.base.registry.registry import Registry
from core.base.viewer.window_place import WindowPlace
from suites.coding.coding_suite import CodingSuite
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS

AUTO_MODE = "journal.suites.coding.auto-mode"


def test_s49_fixture_person_changes_a_control_through_the_viewer_line_route_and_reads_it_back(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        viewer.set_setting(AUTO_MODE, "false")
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, False))


def test_s45_fixture_a_refused_agent_write_leaves_the_value_the_person_sees(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_refusal(f"setting set {AUTO_MODE} off --environment main", "A person was asked", actor=story.agent)
    with person_viewer(story) as viewer:
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, True))


def test_s01_fixture_a_person_change_in_one_story_is_not_seen_by_the_next(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting set {AUTO_MODE} off --environment main", actor=story.user)


def test_s01_fixture_a_story_starts_from_the_declared_default_of_auto_mode(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting show {AUTO_MODE} --environment main", "value: True", actor=story.user)


def limit_rows(viewer):
    status, answer = window_data(viewer.server, viewer.cookie, keys="limits", window="coding.agent-settings", query="environment=main&tab=agents")
    expect_value((status, answer["keys"]["limits"]["code"]), (200, 0))
    return answer["keys"]["limits"]["value"]["rows"]


def test_s49_counts_groups_and_retirement(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success("agent limits --environment main", actor=story.agent)
    with person_viewer(story) as viewer:
        helper = next(row for row in limit_rows(viewer) if row["key"] == "helper")
        names = [row["profile"] for row in helper["profiles"]]
        expect_value((names.count("journal-merger"), names.count("journal-designer"), sum(row["kept"] for row in helper["profiles"]) <= helper["kept"]), (1, 1, True))
        worker = agent_actors(story)["worker"]
        story.expect_refusal(f'agent retire {worker.id} --reason "not needed"', "", actor=story.user)


def test_s51_agent_details_are_paged(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success("agent cards --show all --kept --environment main", actor=story.agent)
    with person_viewer(story) as viewer:
        status, answer = window_data(viewer.server, viewer.cookie, keys="count-agents", window="coding.agent-settings",
                                     query="environment=main&count-agents.role=helper&count-agents.page=1")
        cards = answer["keys"]["count-agents"]
        expect_value((status, cards["code"], cards["value"]["total"] >= 3, len(cards["value"]["rows"]) <= 25), (200, 0, True, True))


WINDOW = "coding.agent-settings"
ORCHESTRATOR_LINE = ["work-settings", "preset", "orchestrator"]


def work_reading(viewer) -> dict:
    status, answer = window_data(viewer.server, viewer.cookie, keys="work", window=WINDOW)
    assert (status, answer["keys"]["work"]["code"]) == (200, 0), answer["keys"]["work"]
    return answer["keys"]["work"]["value"]


def test_s44_the_window_applies_a_preset_in_one_step_and_reads_the_workflow_back(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_text("work-settings show --environment main", "workflow: builder", actor=story.user)
    with person_viewer(story) as viewer:
        shown = work_reading(viewer)
        expect_value((shown["workflow"], shown["controls"][AUTO_MODE]), ("builder", True))
        viewer.server.viewer_line_value(viewer.cookie, {"window": WINDOW, "environment": "main", "line": [*ORCHESTRATOR_LINE, "--revision", shown["revision"]]})
        applied = work_reading(viewer)
        expect_value((applied["workflow"], applied["controls"][AUTO_MODE]), ("orchestrator", False))


def test_s51_the_window_refuses_a_draft_made_from_an_older_reading_and_changes_nothing(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_text("setting show journal.suites.coding.continue-while-delegatable --environment main", "value:", actor=story.user)
    with person_viewer(story) as viewer:
        viewer.set_setting(AUTO_MODE, "true")
        old = work_reading(viewer)["revision"]
        viewer.set_setting("journal.suites.coding.continue-while-delegatable", "true")
        viewer.server.expect_viewer_line(viewer.cookie, {"window": WINDOW, "environment": "main", "line": [*ORCHESTRATOR_LINE, "--revision", old]}, 200, "changed since")
        expect_value(work_reading(viewer)["workflow"], "custom")


TEST_BATCH = "journal.suites.coding.workers.test-batch-size"
FAILURES = "journal.suites.coding.workers.own-test-failures-to-flag"
RUN_LIMIT = "journal.suites.coding.workers.worker-run-limit"


def field_values(reading: dict, group: str) -> dict:
    return {field["key"]: field["value"] for field in reading["fields"] if field["group"] == group}


def test_s24_tests_tab_fields_are_read_and_applied_together(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_text(f"setting show {TEST_BATCH} --environment main", "value:", actor=story.user)
    with person_viewer(story) as viewer:
        shown = work_reading(viewer)
        expect_value(len(field_values(shown, "tests")) > 0, True)
        viewer.server.viewer_line_value(viewer.cookie, {"window": WINDOW, "environment": "main", "line": ["work-settings", "apply", "--revision", shown["revision"], f"{TEST_BATCH}=4", f"{FAILURES}=7"]})
        applied = field_values(work_reading(viewer), "tests")
        expect_value((applied[TEST_BATCH], applied[FAILURES]), (4, 7))


def test_s30_advanced_tab_refuses_a_fraction_for_a_whole_number_and_changes_nothing(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_text(f"setting show {RUN_LIMIT} --environment main", "value:", actor=story.user)
    with person_viewer(story) as viewer:
        shown = work_reading(viewer)
        before = field_values(shown, "advanced")[RUN_LIMIT]
        viewer.server.expect_viewer_line(viewer.cookie, {"window": WINDOW, "environment": "main", "line": ["work-settings", "apply", "--revision", shown["revision"], f"{RUN_LIMIT}=2.5", f"{TEST_BATCH}=9"]}, 200, "whole number")
        after = work_reading(viewer)
        expect_value((field_values(after, "advanced")[RUN_LIMIT], field_values(after, "tests")[TEST_BATCH] != 9), (before, True))


def test_the_context_limit_is_in_the_advanced_tab_and_the_modal_is_no_page(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        advanced = field_values(work_reading(viewer), "advanced")
    declared = next(window for window in Registry.read(story.container.get(Database)).windows if window.name == WINDOW)
    story.expect_rows({CONTEXT_LIMIT_ON, CONTEXT_LIMIT_TOKENS, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS} <= set(advanced), advanced[CONTEXT_LIMIT_ON] is False, declared.place != WindowPlace.PAGE, WINDOW not in CodingSuite.windows, detail=str(advanced))

