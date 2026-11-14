from unittest.mock import patch

from core.modules.processes.ticks.output_reading import OutputReading
from core.modules.processes.ticks.run_timeouts import RunTimeouts


def test_output_reading_and_run_timeouts_with_no_process_running_read_nothing(journal):
    with patch.object(OutputReading, "read", side_effect=AssertionError("the output reading read outputs with no run")):
        assert OutputReading()(journal.container) is False
    assert RunTimeouts()(journal.container) is False
