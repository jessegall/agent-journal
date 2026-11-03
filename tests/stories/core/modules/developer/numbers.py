import json

from core.base.module.performance_tools import PerformanceTools
from core.base.timing_log import TimingLog
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


def numbers(story, flags=""):
    return json.loads(story.run(f"developer numbers {flags}--json", actor=story.user).output_text)["rows"]


def test_the_counts_keep_the_average_and_slowest_of_each_hook_and_sort_by_the_slowest(new_story):
    story = new_story(fixture=UserJoined)
    counts = story.container.get(HookNumbersFile)
    counts.add("stop", 10, 4)
    counts.add("stop", 30, 6)
    counts.add("prompt", 50, 2)
    assert numbers(story)[1] == {"id": "stop", "hook": "stop", "count": 2, "average_ms": 20, "slowest_ms": 30, "average_points": 5}
    assert [row["hook"] for row in numbers(story)] == ["prompt", "stop"]
    assert [row["hook"] for row in numbers(story, "--slowest ")] == ["prompt", "stop"]


def durations_on(story):
    story.expect_success(f"setting set {HOOK_DURATIONS_SETTING} true --project", actor=story.user)


def test_a_reader_is_counted_by_its_name_while_hook_durations_is_on(new_story):
    story = new_story(fixture=UserJoined)
    tools = story.container.get(PerformanceTools)
    tools.run(ReaderTimeTool, "vitest", 12, 1)
    assert numbers(story) == []
    durations_on(story)
    tools.run(ReaderTimeTool, "vitest", 12, 1)
    tools.run(ReaderTimeTool, "vitest", 30, 1)
    assert numbers(story) == [{"id": "reader vitest", "hook": "reader vitest", "count": 2, "average_ms": 21, "slowest_ms": 30, "average_points": 0}]


def test_an_http_route_is_counted_from_the_timing_log_while_hook_durations_is_on(new_story):
    story = new_story(fixture=UserJoined)
    log = TimingLog(story.home)
    for end in (1_004_000, 1_010_000):
        log.write({"request_id": "", "route": "/cli", "line": "task list", "status": 200, "exit_code": 0, "code_version": "x", "timing": f"server_accepted=1000000;answered={end}"})
    log.write({"request_id": "", "route": "/hook?program=claude", "line": "", "status": 200, "exit_code": None, "code_version": "x", "timing": "server_accepted=1000000;answered=1020000"})
    assert numbers(story) == []
    durations_on(story)
    assert numbers(story) == [{"id": "route /cli", "hook": "route /cli", "count": 2, "average_ms": 7, "slowest_ms": 10, "average_points": 0},
                              {"id": "route /hook", "hook": "route /hook", "count": 1, "average_ms": 20, "slowest_ms": 20, "average_points": 0}]


def test_a_reset_starts_the_counts_again_and_the_window_may_read_and_reset(new_story):
    story = new_story(fixture=UserJoined)
    window = WindowStory(story)
    window.expect_window_allowed("developer.numbers", "developer numbers")
    window.expect_window_allowed("developer.numbers", "developer reset-numbers")
    story.container.get(HookNumbersFile).add("stop", 10, 4)
    story.run("developer reset-numbers", actor=story.user)
    assert numbers(story) == []
