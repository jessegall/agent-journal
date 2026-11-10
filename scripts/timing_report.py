"""Lists request stages from transport logs without treating elapsed time as performance cost."""

import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from engine.time.timing import Timing
from engine.journal.journal_home import JournalHome
from engine.performance.performance_state import PerformanceState

LINE_LIMIT = 1000
TOTAL_ROW = "whole request"


def steps(timing: Timing) -> list[str]:
    return [f"{first} -> {second}" for (first, _), (second, _) in zip(timing.stamps, timing.stamps[1:])]


def logged_timings(lines: list[str]) -> list[tuple[str, Timing]]:
    entries = [json.loads(line) for line in lines]
    return [(f"{entry['route']} {entry['line']}".rstrip(), Timing.parsed(entry["timing"])) for entry in entries]


def bypass_timings(lines: list[str]) -> list[tuple[str, Timing]]:
    fields = [line.split() for line in lines]
    return [(f"gave up: hook {parts[2]}", Timing.parsed(parts[4])) for parts in fields if len(parts) == 5]


def report(timings: list[tuple[str, Timing]]) -> str:
    groups: dict[str, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    for name, timing in timings:
        group = groups[name]
        for step in steps(timing):
            group[step] += 1
        if timing.stamps:
            group[TOTAL_ROW] += 1
    rows: list[str] = []
    for name, group in sorted(groups.items()):
        rows.append(f"{name}  ({group[TOTAL_ROW]} requests)")
        rows.append(f"  {'step':42} count")
        for step, count in sorted(group.items(), key=lambda item: item[0] == TOTAL_ROW):
            rows.append(f"  {step:42} {count}")
    return "\n".join(rows)


def last_lines(path: Path) -> list[str]:
    return path.read_text().splitlines()[-LINE_LIMIT:]


def main(argv: list[str]) -> int:
    timing_log = Path(argv[0])
    if not PerformanceState(JournalHome(timing_log.parent.parent)).can_measure:
        print("Development metrics are paused during lifecycle work and tests.")
        return 0
    bypass_log = timing_log.with_name("bypass.log")
    timings = logged_timings(last_lines(timing_log))
    if bypass_log.exists():
        timings += bypass_timings(last_lines(bypass_log))
    print(report(timings))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
