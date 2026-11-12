from engine.database.migration import Migration

PLAN_KEY = '$."journal.core.plans"'
ASSIGNEE_PATH = f"{PLAN_KEY}.assignee_id"
MIGRATION_TIMESTAMP = "strftime('%Y-%m-%dT%H:%M:%S', 'now') || '.000000+00:00'"
CORE_ACTOR = "(SELECT id FROM actors WHERE type = 'core' ORDER BY id LIMIT 1)"
PHASE_ASSIGNMENT = ("SELECT phase_rows.id FROM assignments AS phase_rows JOIN phase_tasks ON phase_tasks.phase_id = phase_rows.subject_id"
                    " WHERE phase_rows.subject_model = 'phase' AND phase_tasks.task_id = assignments.subject_id AND phase_rows.actor_id = assignments.actor_id")


class PlanAssignmentsMigration(Migration):
    """Moves the agent a plan was assigned to from the plan's metadata into the assignments table, given by hand,
    gives each phase of an assigned plan the plan's actor inherited from the plan, and marks a task of such a phase
    that has the same actor as inherited from its phase. A task given to another actor stays given by hand, and a
    plan assigned to an actor that no longer exists is left unassigned."""

    number = 16
    statements = [
        "INSERT INTO assignments (creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at)"
        f" SELECT {CORE_ACTOR}, 'plan', plans.id, json_extract(plans.metadata, '{ASSIGNEE_PATH}'), NULL, 1, '{{}}', {MIGRATION_TIMESTAMP}, {MIGRATION_TIMESTAMP}"
        f" FROM plans JOIN actors ON actors.id = json_extract(plans.metadata, '{ASSIGNEE_PATH}')"
        " WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE subject_model = 'plan' AND subject_id = plans.id)",
        "INSERT INTO assignments (creator_id, subject_model, subject_id, actor_id, source_id, version, metadata, created_at, updated_at)"
        f" SELECT {CORE_ACTOR}, 'phase', phases.id, plan_rows.actor_id, plan_rows.id, 1, '{{}}', {MIGRATION_TIMESTAMP}, {MIGRATION_TIMESTAMP}"
        " FROM phases JOIN assignments AS plan_rows ON plan_rows.subject_model = 'plan' AND plan_rows.subject_id = phases.plan_id"
        " WHERE NOT EXISTS (SELECT 1 FROM assignments WHERE subject_model = 'phase' AND subject_id = phases.id)",
        f"UPDATE assignments SET source_id = ({PHASE_ASSIGNMENT}), version = version + 1"
        f" WHERE subject_model = 'task' AND source_id IS NULL AND EXISTS ({PHASE_ASSIGNMENT})",
        f"UPDATE plans SET metadata = json_remove(metadata, '{ASSIGNEE_PATH}'), version = version + 1 WHERE json_extract(metadata, '{ASSIGNEE_PATH}') IS NOT NULL",
    ]
