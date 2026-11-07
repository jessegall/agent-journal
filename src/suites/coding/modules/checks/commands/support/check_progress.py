from core.base.actor import Actor
from core.base.command.bus import Bus
from suites.coding.modules.checks.commands.record_check_progress.record_check_progress import RecordCheckProgress
from suites.coding.modules.checks.commands.support.check_output_percent import CheckOutputPercent

SMALLEST_STEP_PERCENT = 2


class CheckProgress:
    """Follows one running check: its percent starts at 0 and is recorded each time a printed line takes it a
    step further."""

    def __init__(self, bus: Bus, check_id: int) -> None:
        self.bus, self.check_id = bus, check_id
        self.percent = 0
        self.record(0)

    def read_line(self, line: str) -> None:
        percent = CheckOutputPercent.parsed(line)
        if percent is not None and percent >= self.percent + SMALLEST_STEP_PERCENT:
            self.record(percent)

    def record(self, percent: int) -> None:
        self.percent = percent
        self.bus.run(RecordCheckProgress(self.check_id, percent), Actor.core())
