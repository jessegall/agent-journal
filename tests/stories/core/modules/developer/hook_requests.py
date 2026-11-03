from core.modules.developer.support.hook_request_log import HookRequestLog
from datetime import timedelta
from core.modules.drivers.models.enums.hook_answer import HookAnswer
from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingOn

HEADERS = {"X-Journal-Hook-Id": "firing-1", "X-Journal-Env": "main"}


def logging_story(new_story, size: int = 3):
    story = new_story(fixture=HookRecordingOn)
    story.expect_success(f"setting set journal.core.developer.tools.hooks.request-log-size {size} --project", actor=story.user)
    return story


def test_nothing_is_recorded_while_the_option_is_off(new_story):
    story = new_story(fixture=BuilderWithUser)
    story.container.get(HookRequestLog).record("claude", HEADERS, {"event": "stop"}, 12.5, HookAnswer.ALLOWED)
    story.expect_success("developer hook-requests", "nothing recorded yet")


def test_a_recorded_hook_keeps_its_headers_and_body(new_story):
    story = logging_story(new_story)
    story.container.get(HookRequestLog).record("claude", HEADERS, {"event": "stop"}, 12.5, HookAnswer.ALLOWED)
    row = story.container.get(HookRequestLog).read()[0]
    assert (row.program, row.headers, row.body) == ("claude", HEADERS, {"event": "stop"})


def test_only_the_last_hooks_the_setting_names_are_kept_newest_first(new_story):
    story = logging_story(new_story, size=2)
    log = story.container.get(HookRequestLog)
    for firing in ("first", "second", "third"):
        log.record("claude", HEADERS, {"firing": firing}, 1, HookAnswer.ALLOWED)
    assert [(row.number, row.body["firing"]) for row in log.read()] == [(3, "third"), (2, "second")]


def test_request_rows_include_millisecond_times_day_lines_durations_and_outcomes(new_story):
    story = logging_story(new_story)
    log = story.container.get(HookRequestLog)
    log.record("claude", HEADERS, {"hook_event_name": "PreToolUse", "tool_name": "Bash"}, 812.5, HookAnswer.REFUSED)
    row = log.read()[0].json()
    assert (row["event"], row["tool"], row["duration_ms"], row["outcome"]) == ("PreToolUse", "Bash", 812.5, "refused")
    assert row["day_start"]
    assert len(row["time"]) == 12
    assert row["day"] == row["received_at"][:10]


def test_only_the_first_request_of_each_day_has_a_day_line(new_story):
    story = logging_story(new_story)
    log = story.container.get(HookRequestLog)
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    story.clock.advance(timedelta(days=1))
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    assert [row.day_start for row in log.read()] == [True, True, False]
