import json
from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.enums.hook_answer import HookAnswer
from tests.stories.core.support.coding_fixtures import UserBuilder
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from engine.testing.expectations.expect_row import expect_row
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SIZE_SETTING

HEADERS = {"X-Journal-Hook-Id": "firing-1", "X-Journal-Env": "main"}


def logging_story(played, size: int = 3):
    story = played(HookRecordingEnabled)
    story.expect_success(f"setting set {HOOK_REQUEST_LOG_SIZE_SETTING} {size} --project", actor=story.user)
    return story


def test_nothing_is_recorded_while_the_option_is_off(played):
    story = played(UserBuilder)
    story.container.get(HookRequestLog).record("claude", HEADERS, {"event": "stop"}, 12.5, HookAnswer.ALLOWED)
    story.expect_success("developer hook-requests", "nothing recorded yet")


def test_a_recorded_hook_keeps_its_headers_and_body(played):
    story = logging_story(played)
    story.container.get(HookRequestLog).record("claude", HEADERS, {"event": "stop"}, 12.5, HookAnswer.ALLOWED)
    row = story.container.get(HookRequestLog).read()[0]
    expect_row(row, program="claude", headers=HEADERS, body={"event": "stop"})


def test_only_the_last_hooks_the_setting_names_are_kept_newest_first(played):
    story = logging_story(played, size=2)
    log = story.container.get(HookRequestLog)
    for event_id in ("first", "second", "third"):
        log.record("claude", HEADERS, {"event_id": event_id}, 1, HookAnswer.ALLOWED)
    expect_number_event_id_body(log, [(3, "third"), (2, "second")])


def test_request_rows_include_millisecond_times_day_lines_durations_and_outcomes(played):
    story = logging_story(played)
    log = story.container.get(HookRequestLog)
    log.record("claude", HEADERS, {"hook_event_name": "PreToolUse", "tool_name": "Bash"}, 812.5, HookAnswer.REFUSED)
    row = log.read()[0].json()
    expect_row(row, event="PreToolUse", tool="Bash", duration_ms=812.5, outcome="refused")
    expect_day_start(row)
    expect_time(row, 12)
    expect_row(row, day=row["received_at"][:10])


def expect_day_start_log(log, expected) -> None:
    actual = [row.day_start for row in log.read()]
    assert actual == expected, actual


def expect_time(row, expected) -> None:
    actual = len(row['time'])
    assert actual == expected, actual


def expect_day_start(row) -> None:
    actual = row['day_start']
    assert actual, actual


def expect_number_event_id_body(log, expected) -> None:
    actual = [(row.id, row.body['event_id']) for row in log.read()]
    assert actual == expected, actual


def test_the_window_lists_more_requests_than_the_read_limit_when_the_log_keeps_them(played):
    story = logging_story(played, size=60)
    log = story.container.get(HookRequestLog)
    for event_id in range(60):
        log.record("claude", HEADERS, {"event_id": event_id}, 1, HookAnswer.ALLOWED)
    answer = story.run("developer hook-requests --json", actor=story.user)
    story.expect_rows(answer.code == 0, len(json.loads(answer.output_text)["rows"]) == 60, detail=answer.output_text[:300])


def test_stop_and_session_end_requests_stay_beyond_the_size_of_the_log(played):
    story = logging_story(played, size=2)
    log = story.container.get(HookRequestLog)
    log.record("claude", HEADERS, {"hook_event_name": "Stop"}, 15000, HookAnswer.ALLOWED)
    log.record("claude", HEADERS, {"hook_event_name": "SessionEnd"}, 1, HookAnswer.ALLOWED)
    for event_id in ("first", "second", "third"):
        log.record("claude", HEADERS, {"hook_event_name": "PreToolUse", "event_id": event_id}, 1, HookAnswer.ALLOWED)
    kept = [row.event for row in log.read()]
    story.expect_rows(kept == ["PreToolUse", "PreToolUse", "SessionEnd", "Stop"], detail=str(kept))


def test_a_retried_stop_shows_its_retry_count_on_its_row(played):
    story = logging_story(played)
    log = story.container.get(HookRequestLog)
    log.record("claude", {**HEADERS, "X-Journal-Retries": "3"}, {"hook_event_name": "Stop"}, 4000, HookAnswer.ALLOWED)
    log.record("claude", HEADERS, {"hook_event_name": "Stop"}, 10, HookAnswer.ALLOWED)
    story.expect_rows([row.retries for row in log.read()] == [0, 3])
