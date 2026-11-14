import os
from unittest.mock import patch

from core.modules.plugins.support.plugin_queue import PluginQueue
from core.modules.plugins.ticks.plugin_card_reading import PluginCardReading
from core.modules.processes.ticks.output_reading import OutputReading
from core.modules.processes.ticks.run_timeouts import RunTimeouts
from tests.stories.core.modules.plugins.hooks import installed_story
from tests.stories.core.support.fixtures import UserJoined

LATER_NS = 10**18


def test_output_reading_and_run_timeouts_with_no_process_running_read_nothing(new_story):
    story = new_story(fixture=UserJoined)
    with patch.object(OutputReading, "read", side_effect=AssertionError("the output reading read outputs with no run")):
        assert OutputReading()(story.container) is False
    assert RunTimeouts()(story.container) is False


def test_a_plugin_queue_folder_is_read_again_only_after_it_changed(new_story):
    story = installed_story(new_story)
    queue = story.home.folder / "plugin-data" / "sample" / "queue"
    queue.mkdir(parents=True, exist_ok=True)
    reading = PluginCardReading()
    with patch.object(PluginQueue, "claim_cards", autospec=True, side_effect=lambda plugin_queue: (claim for claim in ())) as claims:
        reading(story.container)
        reading(story.container)
        assert claims.call_count == 1
        (queue / "1.json").write_text("{}")
        os.utime(queue, ns=(LATER_NS, LATER_NS))
        reading(story.container)
        assert claims.call_count == 2
