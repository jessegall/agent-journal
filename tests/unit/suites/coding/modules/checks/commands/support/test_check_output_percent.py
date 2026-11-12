from suites.coding.modules.checks.commands.support.check_output_percent import CheckOutputPercent
from suites.coding.modules.checks.commands.support.check_progress import CheckProgress


def test_a_line_says_how_far_it_has_come_as_a_percent_or_a_count():
    assert CheckOutputPercent.parsed("[ 42%] tests/a.py") == 42
    assert CheckOutputPercent.parsed("detector 4488/4675") == 96
    assert CheckOutputPercent.parsed("no number here") is None
    assert CheckOutputPercent.parsed("src/core/a.py") is None
    assert CheckOutputPercent.parsed("9/3 is too many") is None


class RecordingBus:
    def __init__(self) -> None:
        self.percents: list[int | None] = []

    def run(self, command, actor) -> None:
        self.percents.append(command.percent)


def test_a_percent_is_recorded_at_the_start_and_at_each_step_further():
    bus = RecordingBus()
    progress = CheckProgress(bus, 1)
    for line in ("1/4", "26%", "no number", "[ 50%]", "3/4"):
        progress.read_line(line)
    assert bus.percents == [0, 25, 50, 75]
