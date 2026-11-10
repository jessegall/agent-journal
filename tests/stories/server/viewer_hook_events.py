import pytest

from engine.change.event_log import EventLog
from engine.database.database import Database
from core.base.registry.registry import Registry
from core.testing.hook_samples import HookSamples
from tests.stories.core.base.driver.support.fixtures import LeadStarted
from tests.stories.core.base.driver.support.samples import SAMPLES
from tests.stories.server.support.server_client import server_story
from tests.stories.server.support.viewer_events import expect_event
from tests.stories.support.story_checks import expect_value, expect_value_with


@pytest.fixture
def hook_feed_viewer(new_story):
    with server_story(new_story(SAMPLES, fixture=LeadStarted)) as server:
        server.story.run('actor make user "Ada"')
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        yield server, cookie


def test_hook_feed_windows_receive_each_named_hook_and_read_its_row(hook_feed_viewer):
    server, cookie = hook_feed_viewer
    story = server.story
    windows = {window.name: window for window in Registry.read(story.container.get(Database)).windows}
    for window_name in ["agents.transcript", "drivers.hook-calls", "settings.project-hooks", "coding.terminal"]:
        window = windows[window_name]
        expect_value_with(window.events, "hook_call.*")
        story.expect_success("setting set samples.refuse-stops false --project")
        cursor_id = story.container.get(EventLog).newest_id()
        with server.viewer_stream(cookie, cursor_id, list(window.events)) as response:
            for sample, change in [(HookSamples.prompt("Show the activity"), "prompt"),
                                   (HookSamples.stop(), "stop_allowed"),
                                   (HookSamples.sample("compact"), "compact"),
                                   (HookSamples.session_start(), "session_start")]:
                story.hook("s-1", sample)
                expect_event(response, f"hook_call.{change}")
                value = server.viewer_line_value(cookie, {"window": window_name, "environment": "main", "line": ["hook-call", "feed", "--session-agent-id", str(story.agent.id)]})
                expect_value(value["rows"][0]["hook"], sample.body["event"])
            story.expect_success("setting set samples.refuse-stops true --project")
            story.hook("s-1", HookSamples.stop())
            expect_event(response, "hook_call.stop_refused")
            value = server.viewer_line_value(cookie, {"window": window_name, "environment": "main", "line": ["hook-call", "feed", "--session-agent-id", str(story.agent.id)]})
            expect_value(value["rows"][0]["answer"], "refused")
