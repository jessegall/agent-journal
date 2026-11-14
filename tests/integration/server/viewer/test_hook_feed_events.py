from engine.event.event_log import EventLog
from engine.registry.registry import Registry
from engine.testing.examples.hook_samples import HookSamples
from tests.integration.support.integration_server import integration_server
from tests.integration.support.viewer_events import expect_event
from tests.stories.engine.driver.support.fixtures import LeadStarted
from tests.stories.engine.driver.support.samples import SAMPLES

HOOK_FEED_WINDOWS = ("agents.transcript", "drivers.hook-calls", "settings.project-hooks", "coding.terminal")
SAMPLE_HOOKS = (HookSamples.prompt("Show the activity"), HookSamples.stop(), HookSamples.sample("compact"), HookSamples.session_start(), HookSamples.stop())


def feed_line(lead) -> dict[str, object]:
    return {"environment": "main", "line": ["hook-call", "feed", "--session-agent-id", str(lead.agent.id)]}


def event_of(sample, refused: bool) -> str:
    event = sample.body["event"]
    if event == "stop":
        return "hook_call.stop_refused" if refused else "hook_call.stop_allowed"
    return f"hook_call.{ {'user_prompt_submit': 'prompt'}.get(event, event) }"


def test_hook_feed_windows_receive_each_hook_and_read_its_row_with_its_answer(played):
    lead = played(LeadStarted, SAMPLES)
    lead.expect_success('actor make user "Ada"')
    lead.reads_what_it_must("s-1")
    windows = {window.name: window for window in Registry.read(lead.journal.database).windows}
    with integration_server(lead.journal) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        for window_name in HOOK_FEED_WINDOWS:
            window = windows[window_name]
            assert "hook_call.*" in window.events
            cursor_id = lead.container.get(EventLog).newest_id()
            with server.viewer_stream(cookie, cursor_id, list(window.events)) as response:
                for sample in SAMPLE_HOOKS:
                    reply = lead.hook("s-1", sample)
                    expect_event(response, event_of(sample, bool(reply.refusal)))
                    row = server.viewer_line_value(cookie, {"window": window_name, **feed_line(lead)})["rows"][0]
                    assert (row["hook"], row["answer"] == "refused") == (sample.body["event"], bool(reply.refusal)), row
