"""Prints how long each step of the server's answered requests took, from its timing log: the last 1000 lines,
grouped by route and command line, with the median, 90th percentile and maximum of each pair of neighbouring
stamps and of the whole request. Run as python3 scripts/timing_report.py .journal/runtime/timing.log."""

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


def report(lines: list[str]) -> str:
    groups: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    for raw in lines:
        line = json.loads(raw)
        timing = Timing.parsed(line["timing"])
        group = groups[f"{line['route']} {line['line']}".rstrip()]
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


def main(argv: list[str]) -> int:
    print(report(Path(argv[0]).read_text().splitlines()[-LINE_LIMIT:]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
