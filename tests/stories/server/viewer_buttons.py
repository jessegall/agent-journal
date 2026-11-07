import json
from datetime import datetime, timezone

import pytest

from core.testing.expect_row import expect_row
from tests.stories.core.modules.drivers.support.module_memberships import PATH as SUITES
from tests.stories.core.modules.viewer.support.coding_acme_buttons_module import PATH as BUTTONS
from tests.stories.core.modules.viewer.support.acme_buttons_module import RUNS
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.server.viewer.share import PlanAndPersonFixture, opened, shared_link
from tests.stories.support.story_checks import expect_value

LEGACY = "tests.stories.core.base.chat.support.legacy_buttons_module:LegacyButtonsModule"


@pytest.fixture
def buttons_server(new_story):
    journal = new_story(BUTTONS, f"{SUITES}:SuiteModule", fixture=PlanAndPersonFixture)
    journal.advance(datetime.now(timezone.utc) - journal.clock.timestamp().value)
    journal.expect_success("suite choose coding --environment main", actor=journal.user)
    journal.expect_success("environment make elsewhere /work/elsewhere")
    journal.expect_success("suite choose acme --environment elsewhere", actor=journal.user)
    with server_story(journal) as story:
        yield story


def test_buttons_are_offered_only_where_their_module_is_active(buttons_server):
    story = buttons_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    status, _, body = viewer_answer(story.viewer_port(), "/api/buttons?environment=main", cookie, "")
    expect_value(status, 200)
    button = next(item for item in json.loads(body)["buttons"] if item["name"] == "review.edit")
    expect_row(button, module="acme.review", **{"from": "acme.review"}, runs=RUNS, label="Review", slots=["row.task"])
    expect_row(button["fields"][0], name="priority", choices=[{"key": "normal", "label": "Normal"}, {"key": "high", "label": "High"}])
    status, _, body = viewer_answer(story.viewer_port(), "/api/buttons?environment=elsewhere", cookie, "")
    expect_value(status, 200)
    expect_row(json.loads(body), missing={})
    offered = {item["name"] for item in json.loads(body)["buttons"]}
    expect_value(sorted(name for name in offered if name.startswith(("workers.", "review."))), [])
    expect_value({"plans.approve", "plans.assign-worker", "plans.assign-main", "plan_reviews.critique", "plan_reviews.end-review", "tasks.block", "agents.pause"} <= offered, True)


def test_missing_lines_include_main_and_menu_labels_until_this_person_allows_them(buttons_server):
    story = buttons_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    status, _, body = viewer_answer(story.viewer_port(), "/api/buttons?environment=main", cookie, "")
    expect_value(status, 200)
    missing = json.loads(body)["missing"]["acme.review"]
    expect_value([item["label"] for item in missing], ["Review", "Message"])
    expect_value([item["line"] for item in missing], [RUNS + ' choices={"priority": ["high", "normal"]}', "task edit {row_id} --brief={message}"])
    story.story.expect_success("window allow button:acme.review --type runs --environment main", actor=story.story.user)
    story.expect_viewer_status("/api/buttons?environment=main", 200, cookie, text='"missing": {}')


def test_old_mark_and_dock_buttons_also_show_their_labels_and_missing_lines(new_story):
    with server_story(new_story(LEGACY, fixture=PlanAndPersonFixture)) as story:
        cookie = story.expect_viewer_login(story.viewer_key("Ada"))
        status, _, body = viewer_answer(story.viewer_port(), "/api/buttons?environment=main", cookie, "")
        expect_value(status, 200)
        expect_value(json.loads(body)["missing"]["good"], [{"label": "Edit the task", "line": "task edit {row_id}"},
                                                         {"label": "Dock edit", "line": "task edit {row_id} --brief=Dock"}])
        story.story.expect_success("window allow button:good --type runs --environment main", actor=story.story.user)
        story.expect_viewer_status("/api/buttons?environment=main", 200, cookie, text='"missing": {}')


def test_an_unknown_environment_has_the_same_answer_as_windows(buttons_server):
    story = buttons_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    for route in ("buttons", "windows"):
        story.expect_viewer_status(f"/api/{route}?environment=nowhere", 404, cookie, text="no environment named nowhere")


def test_a_share_session_cannot_fetch_buttons_or_press_any_write(buttons_server):
    story = buttons_server
    _, share = shared_link(story)
    visitor = opened(story, share)
    story.expect_viewer_status("/api/buttons?environment=main", 403, visitor, text="opens only the row it shares")
    for argv in (["plan", "approve", "1"], ["template", "send", "1", "--on=plan:1"],
                 ["task", "edit", "1", "--priority=high", "--brief=Review"]):
        story.expect_viewer_line(visitor, {"window": "messages.chat", "line": argv, "environment": "main"}, 403, "a share link only reads")
