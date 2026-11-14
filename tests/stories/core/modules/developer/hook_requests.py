from core.modules.developer.support.hook_request_log import HookRequestLog
from datetime import timedelta
from engine.enums.hook_answer import HookAnswer
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SIZE_SETTING

HEADERS = {"X-Journal-Hook-Id": "firing-1", "X-Journal-Env": "main"}


def logging_story(new_story, size: int = 3):
    story = new_story(fixture=HookRecordingEnabled)
    story.expect_success(f"setting set {HOOK_REQUEST_LOG_SIZE_SETTING} {size} --project", actor=story.user)
    return story


def test_only_the_first_request_of_each_day_has_a_day_line(new_story):
    story = logging_story(new_story)
    log = story.container.get(HookRequestLog)
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    story.clock.advance(timedelta(days=1))
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    expect_day_start_log(log, [True, True, False])


def expect_day_start_log(log, expected) -> None:
    actual = [row.day_start for row in log.read()]
    assert actual == expected, actual


def expect_time(row, expected) -> None:
    actual = len(row['time'])
    assert actual == expected, actual


def expect_day_start(row) -> None:
    actual = row['day_start']
    assert actual, actual


def expect_number_firing_body(log, expected) -> None:
    actual = [(row.number, row.body['firing']) for row in log.read()]
    assert actual == expected, actual
