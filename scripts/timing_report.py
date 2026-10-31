"""Prints how long each step of the server's answered requests took, from its timing log, and of the hooks that
gave up, from bypass.log beside it: the last 1000 lines of each, grouped by route and command line, with the
median, 90th percentile and maximum of each pair of neighbouring stamps and of the whole request. Run as
python3 scripts/timing_report.py .journal/runtime/timing.log."""

import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from core.base.timing import Timing

LINE_LIMIT = 1000
TOTAL_ROW = "whole request"


def steps(timing: Timing) -> list[tuple[str, float]]:
    return [(f"{first} -> {second}", (second_microseconds - first_microseconds) / 1000)
            for (first, first_microseconds), (second, second_microseconds) in zip(timing.stamps, timing.stamps[1:])]


def logged_timings(lines: list[str]) -> list[tuple[str, Timing]]:
    entries = [json.loads(line) for line in lines]
    return [(f"{entry['route']} {entry['line']}".rstrip(), Timing.parsed(entry["timing"])) for entry in entries]


def bypass_timings(lines: list[str]) -> list[tuple[str, Timing]]:
    fields = [line.split() for line in lines]
    return [(f"gave up: hook {parts[2]}", Timing.parsed(parts[4])) for parts in fields if len(parts) == 5]


def report(timings: list[tuple[str, Timing]]) -> str:
    groups: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    for name, timing in timings:
        group = groups[name]
        for step, milliseconds in steps(timing):
            group[step].append(milliseconds)
        if timing.stamps:
            group[TOTAL_ROW].append((timing.stamps[-1][1] - timing.stamps[0][1]) / 1000)
    rows: list[str] = []
    for name, group in sorted(groups.items()):
        rows.append(f"{name}  ({len(group[TOTAL_ROW])} requests)")
        rows.append(f"  {'step':42} {'median ms':>9} {'p90 ms':>7} {'max ms':>7}")
        for step, values in sorted(group.items(), key=lambda item: item[0] == TOTAL_ROW):
            p90 = statistics.quantiles(values, n=10, method="inclusive")[-1] if len(values) > 1 else values[0]
            rows.append(f"  {step:42} {statistics.median(values):9.2f} {p90:7.2f} {max(values):7.2f}")
    return "\n".join(rows)


def last_lines(path: Path) -> list[str]:
    return path.read_text().splitlines()[-LINE_LIMIT:]


def main(argv: list[str]) -> int:
    timing_log = Path(argv[0])
    bypass_log = timing_log.with_name("bypass.log")
    timings = logged_timings(last_lines(timing_log))
    if bypass_log.exists():
        timings += bypass_timings(last_lines(bypass_log))
    print(report(timings))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
