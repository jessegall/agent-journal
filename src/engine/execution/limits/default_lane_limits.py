from engine.enums.execution_length import ExecutionLength
from engine.enums.execution_priority import ExecutionPriority
from engine.execution.classes.execution_class import UNLIMITED
from engine.execution.limits.pool_limits import PoolLimits
from engine.execution.limits.priority_limit import PriorityLimit
from engine.time.timestamp import MINUTE_SECONDS

# the only place the default load numbers of doc 1266 are written
DEFAULT_LONG_RUNS = 2
RUN_SLOT_COST = 4
IMMEDIATE_LIMIT = PriorityLimit(UNLIMITED, 0)

DEFAULT_CAPACITIES = {
    ExecutionLength.INSTANT: 24,
    ExecutionLength.SHORT: 12,
    ExecutionLength.LONG: DEFAULT_LONG_RUNS * RUN_SLOT_COST,
}

DEFAULT_PRIORITY_LIMITS = {
    ExecutionLength.INSTANT: {
        ExecutionPriority.BACKGROUND: PriorityLimit(3, 10),
        ExecutionPriority.NORMAL: PriorityLimit(6, 3),
        ExecutionPriority.AGENT: PriorityLimit(12, 1),
        ExecutionPriority.RESERVED: PriorityLimit(16, 0.5),
        ExecutionPriority.IMMEDIATE: IMMEDIATE_LIMIT,
    },
    ExecutionLength.SHORT: {
        ExecutionPriority.BACKGROUND: PriorityLimit(2, 30),
        ExecutionPriority.NORMAL: PriorityLimit(4, 10),
        ExecutionPriority.AGENT: PriorityLimit(8, 5),
        ExecutionPriority.RESERVED: PriorityLimit(8, 2),
        ExecutionPriority.IMMEDIATE: IMMEDIATE_LIMIT,
    },
    ExecutionLength.LONG: {
        ExecutionPriority.BACKGROUND: PriorityLimit(2, 10 * MINUTE_SECONDS),
        ExecutionPriority.NORMAL: PriorityLimit(4, 5 * MINUTE_SECONDS),
        ExecutionPriority.AGENT: PriorityLimit(DEFAULT_CAPACITIES[ExecutionLength.LONG], 2 * MINUTE_SECONDS),
        ExecutionPriority.RESERVED: PriorityLimit(DEFAULT_CAPACITIES[ExecutionLength.LONG], MINUTE_SECONDS),
        ExecutionPriority.IMMEDIATE: IMMEDIATE_LIMIT,
    },
}

DEFAULT_POOL_LIMITS = PoolLimits(
    capacities=DEFAULT_CAPACITIES,
    priority_limits=DEFAULT_PRIORITY_LIMITS,
    starter_caps={lane: capacity // 2 for lane, capacity in DEFAULT_CAPACITIES.items()},
    immediate_ceiling=64,
)
