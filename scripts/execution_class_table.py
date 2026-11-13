"""Prints the built-in execution classes and the default lane limits as Markdown tables, read from the code, so
the person can judge the defaults of the one execution queue."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from engine.enums.execution_lane import ExecutionLane  # noqa: E402
from engine.enums.execution_priority import ExecutionPriority  # noqa: E402
from engine.execution.builtin_classes import BUILTIN_CLASSES  # noqa: E402
from engine.execution.default_lane_limits import DEFAULT_LANE_LIMITS  # noqa: E402
from engine.execution.execution_class import UNLIMITED  # noqa: E402

CLASS_TABLE = """## Built-in classes

| Class | Lane | Slot cost | Priority | Class limit |
|---|---|---|---|---|
{rows}
"""
CAPACITY_TABLE = """## Lane capacities

| Lane | Capacity in slot units | Slot units one starter may hold |
|---|---|---|
{rows}

Immediate tickets past {ceiling} running in one lane write one line to the log; none is refused.
"""
LIMIT_TABLE = """## Running limits and longest waits

| Lane | Priority | Running limit in slot units | Longest wait before a raise |
|---|---|---|---|
{rows}
"""


def class_rows() -> str:
    return "\n".join(f"| {row.execution_class.name} | {row.execution_class.lane} | {row.execution_class.slot_cost} | {row.execution_class.priority.name.lower()} | "
                     f"{'none' if row.execution_class.class_limit == UNLIMITED else row.execution_class.class_limit} |" for row in BUILTIN_CLASSES)


def capacity_rows() -> str:
    return "\n".join(f"| {lane} | {DEFAULT_LANE_LIMITS.capacity(lane)} | {DEFAULT_LANE_LIMITS.starter_cap(lane)} |" for lane in ExecutionLane)


def limit_rows() -> str:
    rows = []
    for lane in ExecutionLane:
        for priority in ExecutionPriority:
            limit = DEFAULT_LANE_LIMITS.priority_limit(lane, priority)
            running = "none" if limit.running_limit == UNLIMITED else str(limit.running_limit)
            wait = "never raised" if priority >= ExecutionPriority.RESERVED else f"{limit.longest_wait_seconds:g} s"
            rows.append(f"| {lane} | {priority.name.lower()} | {running} | {wait} |")
    return "\n".join(rows)


def table_text() -> str:
    return "\n".join((CLASS_TABLE.format(rows=class_rows()), CAPACITY_TABLE.format(rows=capacity_rows(), ceiling=DEFAULT_LANE_LIMITS.immediate_ceiling),
                      LIMIT_TABLE.format(rows=limit_rows())))


if __name__ == "__main__":
    print(table_text())
