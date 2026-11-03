import json

from core.base.module.performance_tools import PerformanceTools
from core.base.database.points import Points
from core.base.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.developer_settings import TOOLS_SETTING
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined


DEVELOPER_SWITCH = TOOLS_SETTING


def numbers(story, flags=""):
    return json.loads(story.run(f"developer numbers {flags}--json", actor=story.user).output_text)["rows"]


def test_the_counts_keep_the_average_and_slowest_of_each_hook_and_sort_by_the_slowest(new_story):
    story = new_story(fixture=UserJoined)
    counts = story.container.get(HookNumbersFile)
    counts.add("stop", 4)
    counts.add("stop", 6)
    counts.add("prompt", 20)
    assert numbers(story)[1] == {"id": "stop", "hook": "stop", "count": 2, "most_points": 6, "average_points": 5}
    assert [row["hook"] for row in numbers(story)] == ["prompt", "stop"]
    assert [row["hook"] for row in numbers(story, "--slowest ")] == ["prompt", "stop"]


def durations_on(story):
    story.expect_success(f"setting switch {DEVELOPER_SWITCH} on --project", actor=story.user)


def test_a_reader_is_counted_by_its_name_while_hook_durations_is_on(new_story):
    story = new_story(fixture=UserJoined)
    tools = story.container.get(PerformanceTools)
    tools.run(ReaderTimeTool, "vitest", 12, 1)
    assert numbers(story) == []
    durations_on(story)
    tools.run(ReaderTimeTool, "vitest", 12, 1)
    tools.run(ReaderTimeTool, "vitest", 30, 1)
    assert numbers(story) == [{"id": "reader vitest", "hook": "reader vitest", "count": 2, "most_points": 30, "average_points": 21}], numbers(story)


def test_an_http_route_is_counted_in_points_while_call_costs_are_on(new_story):
    story = new_story(fixture=UserJoined)
    tools = story.container.get(PerformanceTools)
    tools.run(RouteCostTool, "/cli", Points(rows=4))
    assert numbers(story) == []
    durations_on(story)
    tools.run(RouteCostTool, "/cli", Points(rows=4))
    tools.run(RouteCostTool, "/cli", Points(rows=10))
    tools.run(RouteCostTool, "/hook", Points(rows=20))
    assert numbers(story) == [{"id": "route /cli", "hook": "route /cli", "count": 2, "most_points": 10, "average_points": 7},
                               {"id": "route /hook", "hook": "route /hook", "count": 1, "most_points": 20, "average_points": 20}], numbers(story)


def test_a_reset_starts_the_counts_again_and_the_window_may_read_and_reset(new_story):
    story = new_story(fixture=UserJoined)
    window = WindowStory(story)
    window.expect_window_allowed("developer.numbers", "developer numbers")
    window.expect_window_allowed("developer.numbers", "developer reset-numbers")
    story.container.get(HookNumbersFile).add("stop", 4)
    story.run("developer reset-numbers", actor=story.user)
    assert numbers(story) == []
