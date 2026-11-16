from collections.abc import Mapping
from dataclasses import dataclass, replace

from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import UNLIMITED
from engine.execution.limits.priority_limit import PriorityLimit


@dataclass(frozen=True)
class PoolLimits:
    """The load each lane takes: its capacity in slot units, each priority's running limit and longest wait, the
    slot units one starter may hold, and how many immediate tickets pass before one log line is written."""

    capacities: Mapping[ExecutionLength, int]
    priority_limits: Mapping[ExecutionLength, Mapping[ExecutionPriority, PriorityLimit]]
    starter_caps: Mapping[ExecutionLength, int]
    immediate_ceiling: int

    def capacity(self, pool: ExecutionLength) -> int:
        return self.capacities[pool]

    def longest_wait_seconds(self, pool: ExecutionLength, priority: ExecutionPriority) -> float:
        return self.priority_limit(pool, priority).longest_wait_seconds

    def priority_limit(self, pool: ExecutionLength, priority: ExecutionPriority) -> PriorityLimit:
        return self.priority_limits[pool][priority]

    def starter_cap(self, pool: ExecutionLength) -> int:
        return self.starter_caps[pool]

    # a priority's running limit is its share of its lane, so a lane given another capacity keeps each share
    def with_capacities(self, capacities: Mapping[ExecutionLength, int]) -> "PoolLimits":
        limits = {pool: {priority: self.scaled(limit, self.capacities[pool], capacities[pool]) for priority, limit in priorities.items()}
                  for pool, priorities in self.priority_limits.items()}
        return replace(self, capacities=dict(capacities), priority_limits=limits)

    @staticmethod
    def scaled(limit: PriorityLimit, capacity: int, new_capacity: int) -> PriorityLimit:
        if limit.running_limit == UNLIMITED:
            return limit
        return replace(limit, running_limit=max(1, limit.running_limit * new_capacity // capacity))
