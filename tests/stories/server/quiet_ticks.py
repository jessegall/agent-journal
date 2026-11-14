from unittest.mock import patch

from core.modules.processes.ticks.output_reading import OutputReading
from core.modules.processes.ticks.run_timeouts import RunTimeouts
from tests.stories.core.support.fixtures import UserJoined


def test_output_reading_and_run_timeouts_with_no_process_running_read_nothing(new_story):
    story = new_story(fixture=UserJoined)
    with patch.object(OutputReading, "read", side_effect=AssertionError("the output reading read outputs with no run")):
        assert OutputReading()(story.container) is False
    assert RunTimeouts()(story.container) is False
