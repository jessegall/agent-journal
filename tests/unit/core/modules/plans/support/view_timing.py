import sqlite3
import statistics
import time
from collections.abc import Sequence
from dataclasses import dataclass

from core.modules.plans.migrations.m001_plans import PlansTablesMigration
from core.modules.plans.migrations.m010_checkpoints import CheckpointsMigration
from core.modules.plans.models.plan_progress import PlanProgress
from core.modules.plans.models.plan_task import PlanTask
from core.modules.tasks.migrations.m001_tasks import TasksTablesMigration
from core.modules.assignments.migrations.m001_assignments import AssignmentsTableMigration
from core.modules.tasks.migrations.m007_task_delegated_to import TaskDelegationMigration
from core.modules.tasks.migrations.m019_task_complexity import TaskComplexityMigration
from core.modules.tasks.models.open_dependency import OpenDependency

PLAN_COUNT = 2000
PLAN_PHASES = 5
PHASE_TASKS = 4
READ_COUNT = 300
STAMP = "2026-10-31T09:00:00.000000+00:00"
STATES = ("open", "started", "completed", "cancelled")

VIEWS = ((OpenDependency.view, OpenDependency.select), (PlanTask.view, PlanTask.select), (PlanProgress.view, PlanProgress.select))


@dataclass(frozen=True)
class ReadTiming:
    """One read timed by key on the scratch database: its median in milliseconds and SQLite's query plan."""

    name: str
    median_ms: float
    plan: str

    @property
    def scans_tasks(self) -> bool:
        return "SCAN tasks" in self.plan


class ViewTiming:
    """A scratch database of plans, phases and tasks with the plans and tasks modules' views, on which a read by
    key is timed."""

    def __init__(self) -> None:
        self.connection = sqlite3.connect(":memory:")
        for statement in (*TasksTablesMigration.statements, *TaskDelegationMigration.statements, *TaskComplexityMigration.statements, *AssignmentsTableMigration.statements, *PlansTablesMigration.statements, *CheckpointsMigration.statements[:-1], *(f"CREATE VIEW {name} AS {select}" for name, select in VIEWS)):
            self.connection.execute(statement)
        self.fill()

    def fill(self) -> None:
        tasks, phases, places, dependencies = [], [], [], []
        for plan in range(1, PLAN_COUNT + 1):
            for phase_position in range(1, PLAN_PHASES + 1):
                phase = (plan - 1) * PLAN_PHASES + phase_position
                phases.append((phase, plan, phase_position))
                for place in range(1, PHASE_TASKS + 1):
                    task = (phase - 1) * PHASE_TASKS + place
                    state = STATES[task % len(STATES)]
                    tasks.append((task, state, STAMP if state in ("completed", "cancelled") else None))
                    places.append((task, phase, task, place))
                    if place > 1:
                        dependencies.append((task, task, task - 1))
        self.connection.executemany("INSERT INTO plans (id, environment_id, creator_id, title, created_at, updated_at) VALUES (?, 1, 1, 'plan', ?, ?)",
                                    [(plan, STAMP, STAMP) for plan in range(1, PLAN_COUNT + 1)])
        self.connection.executemany("INSERT INTO tasks (id, environment_id, creator_id, title, state, closed_at, created_at, updated_at)"
                                    f" VALUES (?, 1, 1, 'task', ?, ?, '{STAMP}', '{STAMP}')", tasks)
        self.connection.executemany(f"INSERT INTO phases (id, plan_id, creator_id, position, title, created_at, updated_at) VALUES (?, ?, 1, ?, 'phase', '{STAMP}', '{STAMP}')",
                                    phases)
        self.connection.executemany(f"INSERT INTO phase_tasks (id, phase_id, task_id, creator_id, position, created_at, updated_at) VALUES (?, ?, ?, 1, ?, '{STAMP}', '{STAMP}')",
                                    places)
        self.connection.executemany(f"INSERT INTO task_dependencies (id, task_id, dependency_id, creator_id, created_at, updated_at) VALUES (?, ?, ?, 1, '{STAMP}', '{STAMP}')",
                                    dependencies)
        self.connection.execute("ANALYZE")

    def timed(self, name: str, sql: str, keys: Sequence[int]) -> ReadTiming:
        durations = []
        for key in keys:
            started = time.perf_counter()
            self.connection.execute(sql, [key]).fetchall()
            durations.append((time.perf_counter() - started) * 1000)
        plan = " | ".join(row[3] for row in self.connection.execute(f"EXPLAIN QUERY PLAN {sql}", [keys[0]]).fetchall())
        return ReadTiming(name, statistics.median(durations), plan)

    def plan_keys(self) -> list[int]:
        return [1 + (number * 7919) % PLAN_COUNT for number in range(READ_COUNT)]

    def task_keys(self) -> list[int]:
        return [1 + (number * 7919) % (PLAN_COUNT * PLAN_PHASES * PHASE_TASKS) for number in range(READ_COUNT)]
