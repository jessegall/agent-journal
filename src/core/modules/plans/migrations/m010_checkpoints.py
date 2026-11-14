from engine.database.migration import Migration


class CheckpointsMigration(Migration):
    """Creates the reached checkpoints and the passed checkpoints of plans. A checkpoint phase whose tasks are
    all closed at the upgrade gets a pass, so a plan already beyond a checkpoint goes on."""

    number = 10
    statements = (
        "CREATE TABLE checkpoint_reaches (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,"
        " phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE, task_ids TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'running',"
        " is_early INTEGER NOT NULL DEFAULT 0 CHECK (is_early IN (0, 1)), failed_task_ids TEXT NOT NULL DEFAULT '',"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX checkpoint_reaches_phase ON checkpoint_reaches (plan_id, phase_id, id)",
        "CREATE INDEX checkpoint_reaches_environment ON checkpoint_reaches (environment_id, id)",
        "CREATE TABLE checkpoint_passes (id INTEGER PRIMARY KEY, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE RESTRICT,"
        " creator_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, plan_id INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,"
        " phase_id INTEGER NOT NULL REFERENCES phases(id) ON DELETE CASCADE, passed_at TEXT NOT NULL,"
        " version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)),"
        " created_at TEXT NOT NULL, updated_at TEXT NOT NULL) STRICT",
        "CREATE INDEX checkpoint_passes_phase ON checkpoint_passes (plan_id, phase_id)",
        "CREATE INDEX checkpoint_passes_environment ON checkpoint_passes (environment_id, id)",
        "INSERT INTO checkpoint_passes (environment_id, creator_id, plan_id, phase_id, passed_at, created_at, updated_at)"
        " SELECT plans.environment_id, phases.creator_id, phases.plan_id, phases.id, max(tasks.closed_at), max(tasks.closed_at), max(tasks.closed_at)"
        " FROM phases JOIN plans ON plans.id = phases.plan_id JOIN phase_tasks ON phase_tasks.phase_id = phases.id"
        " JOIN tasks ON tasks.id = phase_tasks.task_id WHERE phases.checkpoint = 1"
        " GROUP BY phases.id HAVING count(*) = count(tasks.closed_at)",
    )
