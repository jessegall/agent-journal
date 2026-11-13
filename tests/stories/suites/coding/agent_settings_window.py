from tests.stories.core.support.agent_labels import agent_number
import pytest

from tests.stories.server.window_data_route import window_data
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, agent_actors, person_viewer
from tests.stories.support.story_checks import expect_value
from engine.database.database import Database
from engine.registry.registry import Registry
from engine.enums.window_place import WindowPlace
from suites.coding.coding_suite import CodingSuite
from core.modules.helpers.support.helper_settings import CONTEXT_LIMIT_ACTION, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS, CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS
from suites.coding.modules.workers.support.worker_settings import WORKER_PHASE_TEST_RUNS
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_FAILURE_LIMIT
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.coding_settings import AUTO_MODE_SETTING

AUTO_MODE = f"{AUTO_MODE_SETTING}"


@pytest.fixture
def viewer_person(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        yield story, viewer



def test_s49_fixture_person_changes_a_control_through_the_viewer_line_route_and_reads_it_back(viewer_person):
    _, viewer = viewer_person
    viewer.set_setting(AUTO_MODE, "false")
    status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
    expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, False))


def test_s45_fixture_a_refused_agent_write_leaves_the_value_the_person_sees(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_refusal(f"setting set {AUTO_MODE} off --environment main --reason 'a story asks'", "A user was asked", actor=story.agent)
    with person_viewer(story) as viewer:
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, True))


def test_s01_fixture_a_person_change_in_one_story_is_not_seen_by_the_next(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success(f"setting set {AUTO_MODE} off --environment main", actor=story.user)
    story.expect_success("task list --environment main", actor=story.user)
    with person_viewer(story) as viewer:
        status, auto = window_data(viewer.server, viewer.cookie, keys="auto", window="coding.work-mode")
        expect_value((status, auto["keys"]["auto"]["value"]["value"]), (200, False))


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
        story.expect_refusal(f'agent retire {agent_number(story, worker.id)} --reason "not needed"', "", actor=story.user)


def test_s51_agent_details_are_paged(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_success("agent cards --show all --reusable --environment main", actor=story.agent)
    with person_viewer(story) as viewer:
        status, answer = window_data(viewer.server, viewer.cookie, keys="count-agents", window="coding.agent-settings",
                                     query="environment=main&count-agents.role=helper&count-agents.page=1")
        cards = answer["keys"]["count-agents"]
        expect_value((status, cards["code"], cards["value"]["total"] >= 3, len(cards["value"]["rows"]) <= 25), (200, 0, True, True))


WINDOW = "coding.agent-settings"
ORCHESTRATOR_LINE = ["work-settings", "preset", "orchestrator"]


def active_work_row(viewer) -> dict:
    status, answer = window_data(viewer.server, viewer.cookie, keys="work", window=WINDOW)
    assert (status, answer["keys"]["work"]["code"]) == (200, 0), answer["keys"]["work"]
    return answer["keys"]["work"]["value"]


def test_s44_the_window_applies_a_preset_in_one_step_and_reads_the_workflow_back(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_text("work-settings show --environment main", "workflow: builder", actor=story.user)
    with person_viewer(story) as viewer:
        previous = active_work_row(viewer)
        expect_value((previous["workflow"], previous["controls"][AUTO_MODE]), ("builder", True))
        viewer.server.viewer_line_value(viewer.cookie, {"window": WINDOW, "environment": "main", "line": [*ORCHESTRATOR_LINE, "--revision", previous["revision"]]})
        after = active_work_row(viewer)
        expect_value((after["workflow"], after["controls"][AUTO_MODE]), ("orchestrator", False))


OWN_RUNS = f"{WORKER_PHASE_TEST_RUNS}"
FAILURES = f"{WORKER_RUN_FAILURE_LIMIT}"
RUN_LIMIT = f"{WORKER_RUN_LIMIT}"


def field_values(settings: dict, group: str) -> dict:
    return {field["key"]: field["value"] for field in settings["fields"] if field["group"] == group}


def test_s24_tests_tab_fields_are_read_and_applied_together(new_story):
    story = new_story(fixture=MainControlsActors)
    story.expect_text(f"setting show {OWN_RUNS} --environment main", "value:", actor=story.user)
    with person_viewer(story) as viewer:
        settings = active_work_row(viewer)
        expect_value(len(field_values(settings, "tests")) > 0, True)
        viewer.server.viewer_line_value(viewer.cookie, {"window": WINDOW, "environment": "main", "line": ["work-settings", "apply", "--revision", settings["revision"], f"{OWN_RUNS}=4", f"{FAILURES}=7"]})
        after = field_values(active_work_row(viewer), "tests")
        expect_value((after[OWN_RUNS], after[FAILURES]), (4, 7))


def test_the_context_limit_is_in_the_advanced_tab_and_the_modal_is_no_page(viewer_person):
    story, viewer = viewer_person
    advanced = field_values(active_work_row(viewer), "advanced")
    declared = next(window for window in Registry.read(story.container.get(Database)).windows if window.name == WINDOW)
    story.expect_rows({CONTEXT_LIMIT_ENABLED, CONTEXT_LIMIT_TOKENS, CONTEXT_LIMIT_FINISH_TASK, CONTEXT_LIMIT_HARD_TOKENS} <= set(advanced), advanced[CONTEXT_LIMIT_ENABLED] is False, declared.place != WindowPlace.PAGE, WINDOW not in CodingSuite.windows, detail=str(advanced))


def test_the_context_limit_action_is_a_choice_of_compact_or_clear(viewer_person):
    story, viewer = viewer_person
    action = next(field for field in active_work_row(viewer)["fields"] if field["key"] == CONTEXT_LIMIT_ACTION)
    story.expect_rows(action["type"] == "choice", action["choices"] == ["compact", "clear"], detail=str(action))
