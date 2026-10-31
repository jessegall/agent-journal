"""Prints how long each step of the server's answered requests took, from its trail log: the last 1000 lines,
grouped by route and command line, with the median, 90th percentile and maximum of each pair of neighbouring
stamps and of the whole request. Run as python3 scripts/trail_report.py .journal/runtime/trail.log."""

import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from core.base.trail import Trail

LINE_LIMIT = 1000
WHOLE_REQUEST = "whole request"


def steps(trail: Trail) -> list[tuple[str, float]]:
    return [(f"{earlier} -> {later}", (later_at - earlier_at) / 1000)
            for (earlier, earlier_at), (later, later_at) in zip(trail.stamps, trail.stamps[1:])]


def report(lines: list[str]) -> str:
    groups: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    for raw in lines:
        line = json.loads(raw)
        trail = Trail.parsed(line["trail"])
        group = groups[f"{line['route']} {line['line']}".rstrip()]
        for step, milliseconds in steps(trail):
            group[step].append(milliseconds)
        if trail.stamps:
            group[WHOLE_REQUEST].append((trail.stamps[-1][1] - trail.stamps[0][1]) / 1000)
    printed: list[str] = []
    for name, group in sorted(groups.items()):
        printed.append(f"{name}  ({len(group[WHOLE_REQUEST])} requests)")
        printed.append(f"  {'step':42} {'median ms':>9} {'p90 ms':>7} {'max ms':>7}")
        for step, values in sorted(group.items(), key=lambda item: item[0] == WHOLE_REQUEST):
            p90 = statistics.quantiles(values, n=10, method="inclusive")[-1] if len(values) > 1 else values[0]
            printed.append(f"  {step:42} {statistics.median(values):9.2f} {p90:7.2f} {max(values):7.2f}")
    return "\n".join(printed)


def main(argv: list[str]) -> int:
    print(report(Path(argv[0]).read_text().splitlines()[-LINE_LIMIT:]))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
