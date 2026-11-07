import json

from core.base.change.event_log import EventLog
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story

HELPERS = "journal.suites.coding.builder-starts-helpers"
MERGER = "journal.suites.coding.workers.merger-on"
REFERENCE_KEYS = {"id", "event", "environment", "row_table", "row_id", "actor_id"}


def next_event(response) -> dict[str, object]:
    while True:
        line = response.readline().decode()
        assert line, "The event stream ended before its event"
        if line.startswith("data: ") and "event" in json.loads(line[6:]):
            return json.loads(line[6:])


def revision(story, environment: str) -> str:
    shown = story.run(f"work-settings show --environment {environment}", story.user).output_text
    return next(line for line in shown.splitlines() if line.startswith("revision: ")).removeprefix("revision: ")


def test_s60_project_change_refreshes_inheriting_environment(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("environment make other /work/other", actor=story.user)
    story.expect_text(f"setting show {HELPERS} --environment other", "value: True", actor=story.user)
    story.expect_success(f"setting set {HELPERS} off --project", actor=story.user)
    story.expect_text(f"setting show {HELPERS} --environment other", "value: False", "from: project", actor=story.user)
    story.expect_text(f"setting show {HELPERS} --environment main", "value: False", "from: project", actor=story.user)


def test_s60_overridden_environment_keeps_value(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success(f"setting set {MERGER} on --environment main", actor=story.user)
    story.expect_success("environment make other /work/other", actor=story.user)
    story.expect_success(f"setting set {MERGER} off --project", actor=story.user)
    story.expect_text(f"setting show {MERGER} --environment main", "value: True", "from: environment", actor=story.user)
    story.expect_text(f"setting show {MERGER} --environment other", "value: False", "from: project", actor=story.user)


def test_s60_cross_environment_draft_is_stale(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.expect_success("environment make other /work/other", actor=story.user)
    draft = revision(story, "other")
    story.expect_success(f"setting set {HELPERS} off --project", actor=story.user)
    story.expect_refusal(f"work-settings apply --revision {draft} --environment other {MERGER}=off", "changed since", actor=story.user)
    story.expect_text(f"setting show {MERGER} --environment other", "value: True", actor=story.user)


def test_s60_a_project_change_reaches_a_viewer_of_another_environment_as_a_reference_only(new_story):
    story = new_story(fixture=BuilderWithUser)
    with server_story(story) as server:
        server.story.run('actor make user "Ada"')
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        cursor_id = story.container.get(EventLog).newest_id()
        with server.viewer_stream(cookie, cursor_id, ["setting.*"]) as response:
            story.expect_success(f"setting set {HELPERS} off --project", actor=story.user)
            event = next_event(response)
    assert set(event) == REFERENCE_KEYS and event["environment"] is None and str(event["event"]).startswith("setting."), event
