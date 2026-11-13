from collections.abc import Mapping
from dataclasses import dataclass

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.priority_limit import PriorityLimit


@dataclass(frozen=True)
class LaneLimits:
    """The load each lane takes: its capacity in slot units, each priority's running limit and longest wait, the
    slot units one starter may hold, and how many immediate tickets pass before one log line is written."""

    capacities: Mapping[ExecutionLane, int]
    priority_limits: Mapping[ExecutionLane, Mapping[ExecutionPriority, PriorityLimit]]
    starter_caps: Mapping[ExecutionLane, int]
    immediate_ceiling: int

    def capacity(self, lane: ExecutionLane) -> int:
        return self.capacities[lane]

    def priority_limit(self, lane: ExecutionLane, priority: ExecutionPriority) -> PriorityLimit:
        return self.priority_limits[lane][priority]

    def starter_cap(self, lane: ExecutionLane) -> int:
        return self.starter_caps[lane]
