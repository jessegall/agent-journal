import json

import pytest

from tests.stories.core.modules.usage.support.status_files import save_status_file
from tests.stories.suites.coding.support.main_controls_fixture import MainControlsActors, person_viewer
from tests.stories.suites.coding.support.settings_modal import Modal
from core.modules.helpers.support.helper_settings import HELPER_PROFILE_LIMITS
from core.modules.helpers.support.helper_settings import HELPER_RUN_LIMIT
from suites.coding.modules.workers.support.worker_settings import WORKER_KEPT_LIMIT
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.shipped_profiles import DESIGNER_PROFILE
from suites.coding.support.shipped_profiles import MERGER_PROFILE
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

CONTEXT = "journal.core.helpers.context-limit"
CONTEXT_ON, CONTEXT_TOKENS, CONTEXT_KINDS, CONTEXT_PROFILES = (f"{CONTEXT}-{name}" for name in ("on", "tokens", "kinds", "profiles"))
WORKER_RUN = f"{WORKER_RUN_LIMIT}"
WORKER_KEPT = f"{WORKER_KEPT_LIMIT}"
READ_ONLY_RUN = f"{HELPER_RUN_LIMIT}"
PROFILE_LIMITS = f"{HELPER_PROFILE_LIMITS}"
HELPER_TYPES = "helper-type"
READING = {"context_window": {"used_percentage": 20, "total_input_tokens": 60000}}


class Helpers:
    """The Helpers tab as its client plays it through the viewer routes: the counts of every type, the agents of a
    type, and what the usage read says about the context of each agent."""

    def __init__(self, modal: Modal) -> None:
        self.modal = modal

    def limits(self) -> dict[str, dict[str, object]]:
        return {row["key"]: row for row in self.modal.window_keys("limits")["limits"]["value"]["rows"]}

    def profiles(self) -> dict[str, dict[str, object]]:
        return {profile["profile"]: profile for profile in self.limits()["helper"]["profiles"]}

    def agents(self, role: str) -> dict[str, object]:
        return self.modal.window_keys("count-agents", query=f"environment=main&count-agents.role={role}&count-agents.page=1")["count-agents"]["value"]

    def contexts(self) -> dict[str, tuple[object, object]]:
        shown = self.modal.server.viewer_line_value(self.modal.cookie, {"window": "usage.usage", "environment": "main", "line": ["usage", "show"]})["agents"]
        return {(row["profile"] or row["role"]): (row["context_percent"], row["context_limit_tokens"]) for row in shown}


@pytest.fixture
def helpers(new_story):
    story = new_story(fixture=MainControlsActors)
    with person_viewer(story) as viewer:
        yield story, Helpers(Modal(viewer))


def read_by_agents(story) -> None:
    for session in ("designer-session", "merger-session", "worker-session"):
        save_status_file(story, session, READING)


def test_the_counts_list_the_worker_and_the_read_only_helpers_with_a_row_for_each_profile(helpers):
    _, tab = helpers
    rows = tab.limits()
    profiles = tab.profiles()
    assert set(rows) == {"worker", "helper"}
    assert (profiles[f"{MERGER_PROFILE.name}"]["group"], profiles[f"{DESIGNER_PROFILE.name}"]["group"], profiles[f"{RESEARCHER_PROFILE.name}"]["group"]) == ("merger", "designer", "helpers")
    assert all(isinstance(row["running"], int) and isinstance(row["kept"], int) for row in (*rows.values(), *profiles.values()))
    assert (rows["worker"]["running"], rows["helper"]["running"]) == (1, 3)


def test_a_type_whose_running_count_reaches_its_limit_is_full(helpers):
    _, tab = helpers
    tab.modal.save({WORKER_RUN: "1"}, "helper-type.workers")
    worker = tab.limits()["worker"]
    assert worker["run_limit"] > 0 and worker["running"] >= worker["run_limit"]


def test_the_workers_screen_has_its_settings_and_its_agents_with_the_running_one_first(helpers):
    _, tab = helpers
    nodes = tab.modal.nodes("helper-type.workers")
    assert WORKER_RUN in nodes and WORKER_KEPT in nodes
    states = [card["state"] for card in tab.agents("worker")["rows"]]
    assert states == sorted(states, key=lambda state: state != "running") and states


def test_the_agents_of_a_type_say_whether_they_run_so_retiring_is_offered_for_idle_ones_only(helpers):
    _, tab = helpers
    cards = tab.agents("helper")["rows"]
    assert {card["profile"] for card in cards} == {"", f"{MERGER_PROFILE.name}", f"{DESIGNER_PROFILE.name}"}
    assert all(card["state"] in {"running", "idle"} and card["retired_at"] is None for card in cards)


def test_a_profiles_own_limits_leave_the_line_of_every_profile_and_the_line_leaves_them(helpers):
    _, tab = helpers
    every = tab.modal.value("helper-type.read-only", READ_ONLY_RUN)
    assert json.loads(tab.modal.value("helper-type.read-only", PROFILE_LIMITS)) == []
    tab.modal.save({PROFILE_LIMITS: f'["{RESEARCHER_PROFILE.name}:2:5"]'}, "helper-type.read-only")
    assert tab.modal.value("helper-type.read-only", READ_ONLY_RUN) == every
    assert tab.profiles()[f"{RESEARCHER_PROFILE.name}"]["run_limit"] == 2
    tab.modal.save({READ_ONLY_RUN: str(int(every) + 1)}, "helper-type.read-only")
    assert json.loads(tab.modal.value("helper-type.read-only", PROFILE_LIMITS)) == [f"{RESEARCHER_PROFILE.name}:2:5"]
    assert tab.profiles()[f"{RESEARCHER_PROFILE.name}"]["run_limit"] == 2


def test_a_context_cap_set_on_the_screen_of_a_type_is_the_cap_its_agent_bar_counts_against(helpers):
    story, tab = helpers
    tab.modal.save({CONTEXT_ON: "on", CONTEXT_PROFILES: f'["{DESIGNER_PROFILE.name}:150000"]'}, "advanced", HELPER_TYPES)
    assert json.loads(tab.modal.value(HELPER_TYPES, CONTEXT_PROFILES)) == [f"{DESIGNER_PROFILE.name}:150000"]
    assert CONTEXT_PROFILES not in tab.modal.nodes("advanced")
    read_by_agents(story)
    designer = tab.contexts()[f"{DESIGNER_PROFILE.name}"]
    assert designer == (40, 150000)
    assert tab.modal.value("advanced", CONTEXT_TOKENS) == 400000


def test_a_type_set_to_no_cap_shows_no_percent_of_a_cap(helpers):
    story, tab = helpers
    tab.modal.save({CONTEXT_ON: "on", CONTEXT_PROFILES: f'["{DESIGNER_PROFILE.name}:none"]'}, "advanced", HELPER_TYPES)
    read_by_agents(story)
    percent, limit = tab.contexts()[f"{DESIGNER_PROFILE.name}"]
    assert limit is None and percent == 20


def test_the_kind_table_sets_the_workers_cap_and_a_type_with_a_cap_of_its_own_uses_that_instead(helpers):
    story, tab = helpers
    tab.modal.save({CONTEXT_ON: "on", CONTEXT_KINDS: '["worker:200000"]', CONTEXT_PROFILES: f'["{DESIGNER_PROFILE.name}:150000"]'}, "advanced", HELPER_TYPES)
    read_by_agents(story)
    shown = tab.contexts()
    assert shown["worker"] == (30, 200000)
    assert shown[f"{DESIGNER_PROFILE.name}"] == (40, 150000)
    assert shown[f"{MERGER_PROFILE.name}"][1] is None


def test_the_counts_read_again_give_the_same_table(helpers):
    _, tab = helpers
    assert tab.limits() == tab.limits()
    assert tab.modal.line(["agent", "limits"])["rows"] == list(tab.limits().values())


def test_a_type_with_no_agents_has_none_to_list(helpers):
    _, tab = helpers
    assert tab.agents("reviewer")["rows"] == []
