from dataclasses import dataclass

from core.base.timestamp import Timestamp
from core.modules.processes.models.watch import Watch

SECONDS_PER_MINUTE = 60
STEP_MINUTES = (5, 10, 15)


@dataclass(frozen=True)
class OutputCheckSchedule:
    """When a watching agent is woken to confirm its run still does its work: 5 minutes after it began to
    wait, 10 minutes after that, 15 after that and every 15 from then on, so at 5, 15, 30 and 45 minutes
    when each wake is confirmed; a wake nobody confirmed comes again after the same wait, and each confirm
    moves the next wake to the next step."""

    def wait_seconds(self, watch: Watch) -> int:
        return STEP_MINUTES[min(watch.confirmed_count, len(STEP_MINUTES) - 1)] * SECONDS_PER_MINUTE

    def is_due(self, watch: Watch, timestamp: Timestamp) -> bool:
        waiting_since = watch.woke_at or watch.creation_timestamp()
        return waiting_since.elapsed_seconds(timestamp) >= self.wait_seconds(watch)
