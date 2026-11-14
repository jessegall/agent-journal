from collections.abc import Mapping
from dataclasses import dataclass, replace

from engine.enums.execution_lane import ExecutionLane
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import UNLIMITED
from engine.execution.limits.priority_limit import PriorityLimit


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

    # a priority's running limit is its share of its lane, so a lane given another capacity keeps each share
    def with_capacities(self, capacities: Mapping[ExecutionLane, int]) -> "LaneLimits":
        limits = {lane: {priority: self.scaled(limit, self.capacities[lane], capacities[lane]) for priority, limit in priorities.items()}
                  for lane, priorities in self.priority_limits.items()}
        return replace(self, capacities=dict(capacities), priority_limits=limits)

    @staticmethod
    def scaled(limit: PriorityLimit, capacity: int, new_capacity: int) -> PriorityLimit:
        if limit.running_limit == UNLIMITED:
            return limit
        return replace(limit, running_limit=max(1, limit.running_limit * new_capacity // capacity))
