import json
from collections import defaultdict

from core.base.journal_home import JournalHome
from core.base.timing import Timing
from core.modules.developer.support.hook_number import HookNumber

READ_BYTES = 1_000_000
MILLISECOND_MICROSECONDS = 1000


class RouteTimes:
    """What each HTTP route of the journal's server has cost lately, counted from the newest lines of the
    timing log that every answered request writes: how many requests, their average and slowest time from
    the first stamp to the answer."""

    def __init__(self, home: JournalHome) -> None:
        self.path = home.timing_log

    def read(self) -> list[HookNumber]:
        durations: dict[str, list[int]] = defaultdict(list)
        for line in self.newest_lines():
            try:
                fields = json.loads(line)
            except json.JSONDecodeError:
                continue
            stamps = Timing.parsed(str(fields.get("timing", ""))).stamps
            if fields.get("route") and len(stamps) > 1:
                durations[str(fields["route"]).partition("?")[0]].append((stamps[-1][1] - stamps[0][1]) // MILLISECOND_MICROSECONDS)
        return [HookNumber(f"route {route}", len(durations_ms), sum(durations_ms), max(durations_ms), 0) for route, durations_ms in durations.items()]

    def newest_lines(self) -> list[str]:
        if not self.path.exists():
            return []
        with self.path.open("rb") as log:
            size = log.seek(0, 2)
            log.seek(max(0, size - READ_BYTES))
            text = log.read().decode(errors="replace")
        lines = text.splitlines()
        return lines[1:] if size > READ_BYTES else lines
