import sqlite3

import pytest

from core.modules.plans.conditions.checkpoint_limit import CheckpointLimit
from core.modules.plans.migrations.m010_checkpoints import CheckpointsMigration
from core.modules.plans.models.support.views import PLAN_TASKS_SELECT

SCHEMA = (
    "CREATE TABLE environments (id INTEGER PRIMARY KEY)",
    "CREATE TABLE actors (id INTEGER PRIMARY KEY)",
    "CREATE TABLE plans (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL)",
    "CREATE TABLE phases (id INTEGER PRIMARY KEY, plan_id INTEGER NOT NULL, creator_id INTEGER NOT NULL, position INTEGER NOT NULL, checkpoint INTEGER NOT NULL)",
    "CREATE TABLE tasks (id INTEGER PRIMARY KEY, state TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 0, closed_at TEXT)",
    "CREATE TABLE phase_tasks (id INTEGER PRIMARY KEY, phase_id INTEGER NOT NULL, task_id INTEGER NOT NULL, position INTEGER NOT NULL)",
    f"CREATE VIEW plan_tasks AS {PLAN_TASKS_SELECT}",
    "INSERT INTO environments VALUES (1)", "INSERT INTO actors VALUES (1)", "INSERT INTO plans VALUES (1, 1)",
    "INSERT INTO phases VALUES (1, 1, 1, 1, 1), (2, 1, 1, 2, 0)",
    "INSERT INTO phase_tasks VALUES (1, 1, 1, 1), (2, 1, 2, 2), (3, 2, 3, 1)",
)
CLOSED_AT = "2026-10-31T09:00:00+00:00"


def plan(first_closed: bool, second_closed: bool) -> sqlite3.Connection:
    database = sqlite3.connect(":memory:")
    for statement in SCHEMA:
        database.execute(statement)
    for task_id, is_closed in ((1, first_closed), (2, second_closed), (3, False)):
        database.execute("INSERT INTO tasks (id, state, closed_at) VALUES (?, ?, ?)", (task_id, "completed" if is_closed else "open", CLOSED_AT if is_closed else None))
    return database


def open_places(database: sqlite3.Connection) -> list[int]:
    limit = CheckpointLimit().statement()
    return [row[0] for row in database.execute(f"SELECT task_id FROM plan_tasks WHERE plan_id = 1 AND closed_at IS NULL AND {limit.sql} ORDER BY task_id", limit.parameters)]


def test_the_phase_after_a_checkpoint_stays_closed_while_the_checkpoint_has_an_open_task_or_no_pass_and_opens_with_the_pass():
    waiting, reached = plan(True, False), plan(True, True)
    for database in (waiting, reached):
        for statement in CheckpointsMigration.statements[:-1]:
            database.execute(statement)
    assert (open_places(waiting), open_places(reached)) == ([2], [])
    reached.execute("INSERT INTO checkpoint_passes (environment_id, creator_id, plan_id, phase_id, passed_at, created_at, updated_at) VALUES (1, 1, 1, 1, ?, ?, ?)", [CLOSED_AT] * 3)
    assert open_places(reached) == [3]


@pytest.mark.parametrize("second_closed, passed_phases, places", [(True, [1], [3]), (False, [], [2])])
def test_the_upgrade_gives_a_checkpoint_whose_tasks_are_all_closed_its_pass_so_a_plan_beyond_it_goes_on(second_closed, passed_phases, places):
    database = plan(True, second_closed)
    for statement in CheckpointsMigration.statements:
        database.execute(statement)
    assert [row[0] for row in database.execute("SELECT phase_id FROM checkpoint_passes")] == passed_phases
    assert open_places(database) == places
