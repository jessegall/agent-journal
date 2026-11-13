import json
import pytest

from engine.query.queries import Queries
from core.modules.settings.models.setting import Setting
from tests.stories.core.modules.usage.agent_rows import StatesAgents
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.browser_story import expect_browser
from core.modules.helpers.support.helper_settings import HELPER_PROFILE_LIMITS
from suites.coding.modules.workers.support.worker_settings import WORKER_KEPT_LIMIT
from suites.coding.modules.workers.support.worker_settings import WORKER_RUN_LIMIT
from suites.coding.support.shipped_profiles import RESEARCHER_PROFILE

RUN = f"{WORKER_RUN_LIMIT}"
KEPT = f"{WORKER_KEPT_LIMIT}"
PROFILES = f"{HELPER_PROFILE_LIMITS}"


@pytest.fixture
def agent_limits_server(new_story):
    story = new_story(fixture=StatesAgents)
    story.expect_success(f"setting set {RUN} 3 --project", actor=story.user)
    story.expect_success(f"setting set {KEPT} 5 --project", actor=story.user)
    story.expect_success(f"setting set {RUN} 1 --environment main", actor=story.user)
    story.expect_success(f"setting set {KEPT} 0 --environment main", actor=story.user)
    story.expect_success(f'setting set {PROFILES} \'["journal-researcher:2:3"]\' --project', actor=story.user)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield server, cookie


def line(server, cookie, command):
    return server.viewer_line_value(cookie, {"window": "agents.agents", "environment": "main", "line": command})


def test_agent_limits_read_the_environment_and_profile_values_in_force(agent_limits_server):
    server, cookie = agent_limits_server
    rows = line(server, cookie, ["agent", "limits"])["rows"]
    worker = next(row for row in rows if row["key"] == "worker")
    server.story.expect_rows((worker["running"], worker["kept"], worker["run_limit"], worker["kept_limit"]) == (0, 1, 1, 0))
    helper = next(row for row in rows if row["key"] == "helper")
    server.story.expect_rows(helper["per_profile"] and (helper["run_limit"], helper["kept_limit"]) == (4, 8))
    profile = next(row for row in helper["profiles"] if row["profile"] == f"{RESEARCHER_PROFILE.name}")
    server.story.expect_rows((profile["running"], profile["kept"], profile["run_limit"], profile["kept_limit"]) == (0, 1, 2, 3))
    server.story.expect_rows(sum(row["kept"] for row in rows) == 2)


def test_a_person_sets_both_agent_limits_for_the_selected_environment(agent_limits_server):
    server, cookie = agent_limits_server
    line(server, cookie, ["setting", "set", RUN, "6", "--environment", "main"])
    line(server, cookie, ["setting", "set", KEPT, "9", "--environment", "main"])
    worker = next(row for row in line(server, cookie, ["agent", "limits"])["rows"] if row["key"] == "worker")
    server.story.expect_rows(worker["run_limit"] == 6 and worker["kept_limit"] == 9)
    settings = server.story.container.get(Queries).query(Setting)
    server.story.expect_rows(json.loads(settings.filter(key=RUN, environment_id=None).first().value) == 3)
    server.story.expect_rows(json.loads(settings.filter(key=KEPT, environment_id=None).first().value) == 5)


def test_an_agent_cannot_change_either_number(agent_limits_server):
    server, cookie = agent_limits_server
    for key in (RUN, KEPT):
        server.story.expect_refusal(f'setting set {key} 9 --environment main --reason "more room for helpers"', "A user was asked", actor=server.story.agent)
    worker = next(row for row in line(server, cookie, ["agent", "limits"])["rows"] if row["key"] == "worker")
    server.story.expect_rows(worker["run_limit"] == 1 and worker["kept_limit"] == 0)


def test_the_mode_menu_opens_both_limits_and_a_person_changes_them(agent_limits_server):
    server, _ = agent_limits_server
    expect_browser(server, "agentLimits.browser.mjs", ["/tmp/worker-675-agent-limits"])
    settings = server.story.container.get(Queries).query(Setting)
    server.story.expect_rows(json.loads(settings.filter(key=RUN, environment_id=1).first().value) == 2)
    server.story.expect_rows(json.loads(settings.filter(key=KEPT, environment_id=1).first().value) == 7)


def settings_line(server, cookie, command, window="coding.agent-settings"):
    return server.viewer_line_value(cookie, {"window": window, "environment": "main", "line": command})


@pytest.mark.parametrize("window", ["coding.agent-settings", "coding.work-mode"])
def test_a_person_sets_one_profiles_counts_through_the_profile_screen_route(agent_limits_server, window):
    server, cookie = agent_limits_server
    settings_line(server, cookie, ["agent", "profile-limits", "helper", f"{RESEARCHER_PROFILE.name}", "--running", "1", "--kept", "6", "--environment", "main"], window)
    helper = next(row for row in settings_line(server, cookie, ["agent", "limits"], window)["rows"] if row["key"] == "helper")
    profile = next(row for row in helper["profiles"] if row["profile"] == f"{RESEARCHER_PROFILE.name}")
    server.story.expect_rows((profile["run_limit"], profile["kept_limit"]) == (1, 6))
    server.story.expect_rows((helper["run_limit"], helper["kept_limit"]) == (4, 8))


def test_an_agent_cannot_set_a_profiles_counts(agent_limits_server):
    server, cookie = agent_limits_server
    server.story.expect_refusal("agent profile-limits helper journal-researcher --running 9 --kept 9 --environment main --reason \"fewer\"", "A user was asked", actor=server.story.agent)
    helper = next(row for row in line(server, cookie, ["agent", "limits"])["rows"] if row["key"] == "helper")
    profile = next(row for row in helper["profiles"] if row["profile"] == f"{RESEARCHER_PROFILE.name}")
    server.story.expect_rows((profile["run_limit"], profile["kept_limit"]) == (2, 3))
