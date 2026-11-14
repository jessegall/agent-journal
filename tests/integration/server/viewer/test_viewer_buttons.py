import json

import pytest

from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import viewer_answer
from tests.integration.support.share_links import opened, plan_and_person, shared_link
from tests.stories.core.modules.drivers.support.module_memberships import PATH as SUITES
from tests.stories.core.modules.viewer.support.acme_buttons_module import RUNS
from tests.stories.core.modules.viewer.support.coding_acme_buttons_module import PATH as BUTTONS

LEGACY = "tests.stories.engine.chat.support.legacy_buttons_module:LegacyButtonsModule"


def synced(journal, *modules: str) -> None:
    for module in modules:
        answer = journal.synced_with(module)
        assert answer.code == 0, answer.text


def buttons(server, cookie: str, environment: str) -> dict[str, object]:
    status, _, body = viewer_answer(server.viewer_port(), f"/api/buttons?environment={environment}", cookie, "")
    assert status == 200, body
    return json.loads(body)


# the coding suite in main and the sample acme suite in elsewhere, where the acme buttons module is active
@pytest.fixture
def buttons_server(journal):
    user = plan_and_person(journal)
    synced(journal, BUTTONS, f"{SUITES}:SuiteModuleJoining", f"{SUITES}:AcmeSuiteOfSuiteModule")
    for line in ("suite choose coding --environment main", "environment make elsewhere /work/elsewhere", "suite choose acme --environment elsewhere"):
        assert journal.run(line, user).code == 0, line
    with integration_server(journal) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user


def test_buttons_are_offered_only_where_their_module_is_active(buttons_server):
    server, cookie, _ = buttons_server
    button = next(item for item in buttons(server, cookie, "main")["buttons"] if item["name"] == "review.edit")
    assert (button["module"], button["from"], button["runs"], button["label"], button["slots"]) == ("acme.review", "acme.review", RUNS, "Review", ["row.task"]), button
    assert button["fields"][0]["name"] == "priority" and button["fields"][0]["choices"] == [{"key": "normal", "label": "Normal"}, {"key": "high", "label": "High"}]
    elsewhere = buttons(server, cookie, "elsewhere")
    assert elsewhere["missing"] == {}
    offered = {item["name"] for item in elsewhere["buttons"]}
    assert sorted(name for name in offered if name.startswith(("workers.", "review."))) == []
    assert {"plans.approve", "plans.assign-agent", "plans.assign-main", "plan_reviews.critique", "plan_reviews.end-review", "tasks.block", "agents.pause"} <= offered


def test_missing_lines_include_main_and_menu_labels_until_this_person_allows_them(buttons_server):
    server, cookie, user = buttons_server
    missing = buttons(server, cookie, "main")["missing"]["acme.review"]
    assert [item["label"] for item in missing] == ["Review", "Message"]
    assert [item["line"] for item in missing] == [RUNS + ' choices={"priority": ["high", "normal"]}', "task edit {row_id} --brief={message}"]
    assert server.journal.run("window allow button:acme.review --type runs --environment main", user).code == 0
    server.expect_viewer_status("/api/buttons?environment=main", 200, cookie, text='"missing": {}')


def test_old_mark_and_dock_buttons_also_show_their_labels_and_missing_lines(journal):
    user = plan_and_person(journal)
    synced(journal, LEGACY)
    with integration_server(journal) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        assert buttons(server, cookie, "main")["missing"]["good"] == [{"label": "Edit the task", "line": "task edit {row_id}"},
                                                                     {"label": "Dock edit", "line": "task edit {row_id} --brief=Dock"}]
        assert journal.run("window allow button:good --type runs --environment main", user).code == 0
        server.expect_viewer_status("/api/buttons?environment=main", 200, cookie, text='"missing": {}')


def test_an_unknown_environment_has_the_same_answer_as_windows(buttons_server):
    server, cookie, _ = buttons_server
    for route in ("buttons", "windows"):
        server.expect_viewer_status(f"/api/{route}?environment=nowhere", 404, cookie, text="no environment named nowhere")


def test_a_share_session_cannot_fetch_buttons_or_press_any_write(buttons_server):
    server, _, user = buttons_server
    _, share = shared_link(server, user)
    visitor = opened(server, share)
    server.expect_viewer_status("/api/buttons?environment=main", 403, visitor, text="opens only the row it shares")
    for argv in (["plan", "approve", "1"], ["template", "send", "1", "--on=plan:1"], ["task", "edit", "1", "--priority=high", "--brief=Review"]):
        server.expect_viewer_line(visitor, {"window": "messages.chat", "line": argv, "environment": "main"}, 403, "a share link only reads")
