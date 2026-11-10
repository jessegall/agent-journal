import json

from core.base.module.performance_tools import PerformanceTools
from core.base.database.points import Points
from engine.performance.route_cost_tool import RouteCostTool
from core.modules.developer.support.hook_numbers_file import HookNumbersFile
from core.modules.developer.support.reader_time_tool import ReaderTimeTool
from tests.stories.core.modules.viewer.support.window_story import WindowStory
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.modules.developer.support.performance_fixture import DevelopmentToolsEnabled


def numbers(story, flags=""):
    return json.loads(story.run(f"developer numbers {flags}--json", actor=story.user).output_text)["rows"]


def test_the_counts_keep_the_average_and_slowest_of_each_hook_and_sort_by_the_slowest(new_story):
    story = new_story(fixture=UserJoined)
    counts = story.container.get(HookNumbersFile)
    counts.add("stop", 4)
    counts.add("stop", 6)
    counts.add("prompt", 20)
    expect_numbers_2(story, {"id": "stop", "hook": "stop", "count": 2, "most_points": 6, "average_points": 5})
    expect_hook_numbers_2(story, ["prompt", "stop"])
    expect_hook_numbers(story, "--slowest ", ["prompt", "stop"])


def test_a_reader_is_counted_by_its_name_while_hook_durations_is_on(new_story):
    story = new_story(fixture=DevelopmentToolsEnabled)
    tools = story.container.get(PerformanceTools)
    tools.run(ReaderTimeTool, "vitest", 12)
    tools.run(ReaderTimeTool, "vitest", 30)
    expect_numbers(story, [{"id": "reader vitest", "hook": "reader vitest", "count": 2, "most_points": 30, "average_points": 21}])


def test_an_http_route_is_counted_in_points_while_call_costs_are_on(new_story):
    story = new_story(fixture=DevelopmentToolsEnabled)
    tools = story.container.get(PerformanceTools)
    tools.run(RouteCostTool, "/cli", Points(rows=4))
    tools.run(RouteCostTool, "/cli", Points(rows=10))
    tools.run(RouteCostTool, "/hook", Points(rows=20))
    expect_numbers(story, [{"id": "route /cli", "hook": "route /cli", "count": 2, "most_points": 10, "average_points": 7},
                               {"id": "route /hook", "hook": "route /hook", "count": 1, "most_points": 20, "average_points": 20}])


def test_a_reset_starts_the_counts_again_and_the_window_may_read_and_reset(new_story):
    story = new_story(fixture=UserJoined)
    window = WindowStory(story)
    window.expect_window_allowed("developer.numbers", "developer numbers")
    window.expect_window_allowed("developer.numbers", "developer reset-numbers")
    story.container.get(HookNumbersFile).add("stop", 4)
    story.run("developer reset-numbers", actor=story.user)
    expect_numbers(story, [])


def expect_numbers(story, expected, flags="") -> None:
    actual = numbers(story, flags)
    assert actual == expected, actual


def expect_hook_numbers(story, text, expected) -> None:
    actual = [row['hook'] for row in numbers(story, text)]
    assert actual == expected, actual


def expect_hook_numbers_2(story, expected) -> None:
    actual = [row['hook'] for row in numbers(story)]
    assert actual == expected, actual


def expect_numbers_2(story, expected) -> None:
    actual = numbers(story)[1]
    assert actual == expected, actual
