import json

from core.modules.developer.support.hook_numbers_file import HookNumbersFile
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


def test_a_reset_starts_the_counts_again_and_the_window_may_read_and_reset(new_story):
    story = new_story(fixture=UserJoined)
    window = WindowStory(story)
    window.expect_window_allowed("developer.numbers", "developer numbers")
    window.expect_window_allowed("developer.numbers", "developer reset-numbers")
    story.container.get(HookNumbersFile).add("stop", 10, 4)
    story.run("developer reset-numbers", actor=story.user)
    assert numbers(story) == []
