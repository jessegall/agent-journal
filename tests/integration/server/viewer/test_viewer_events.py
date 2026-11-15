from engine.event.event_log import EventLog
from engine.testing.examples.hook_samples import HookSamples
from tests.integration.support.viewer_events import expect_event

SESSION = "s-1"


def post_prompt(server, text: str) -> None:
    server.expect_hook_answer("/hook", dict(HookSamples.prompt(text).with_fields(session=SESSION, event_id=f"prompt-{text}").body), 200, '"refusal":')


def started_agent(server) -> None:
    server.start_agent(SESSION)
    assert server.run_as("overview", SESSION).exit_code == 0


def test_an_event_stream_resumed_after_its_last_id_loses_nothing(person_server):
    server, cookie, _ = person_server
    for number in range(3):
        assert server.journal.run(f'task make "Task {number}" --brief "A task to stream" --environment main').code == 0
    first_ids = server.viewer_event_ids(cookie, 0, 3)
    server.expect_viewer_event_ids(cookie, first_ids[0], 2, first_ids[1:])


def test_a_stream_sends_no_hook_call_when_its_windows_follow_only_tasks(person_server):
    server, cookie, _ = person_server
    started_agent(server)
    cursor_id = server.journal.container.get(EventLog).newest_id()
    with server.viewer_stream(cookie, cursor_id, ["task.create"]) as response:
        post_prompt(server, "Read the task window")
        assert server.journal.run('task make "Check stream filtering" --brief "A task the stream shows" --environment main').code == 0
        expect_event(response, "task.create")


def test_a_stream_keeps_hook_calls_when_a_window_follows_them(person_server):
    server, cookie, _ = person_server
    started_agent(server)
    cursor_id = server.journal.container.get(EventLog).newest_id()
    with server.viewer_stream(cookie, cursor_id, ["hook_call.*"]) as response:
        assert server.journal.run('task make "Check call filtering" --brief "A task the stream skips" --environment main').code == 0
        post_prompt(server, "Read the call window")
        expect_event(response, "hook_call.prompt")
