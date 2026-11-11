from engine.database.migration import Migration

UPGRADE_TIME = "strftime('%Y-%m-%dT%H:%M:%f', 'now'{shift}) || '000+00:00'"
UPGRADE_ANSWER_MINUTES = 10
UPGRADE_FORWARD_MINUTES = 30
QUESTION_WAIT_SQL = ("SELECT waits.id FROM waits WHERE waits.session_agent_id = merger_lines.worker_id AND waits.state = 'open'"
                 " AND waits.type IN ('answer', 'help_request') ORDER BY waits.id DESC LIMIT 1")
ACTIVE_QUESTION_SQL = ("worker_id IS NOT NULL AND EXISTS (" + QUESTION_WAIT_SQL + ")"
            " AND EXISTS (SELECT 1 FROM agents WHERE agents.id = merger_lines.worker_id AND agents.retired_at IS NULL)"
            " AND EXISTS (SELECT 1 FROM tasks WHERE tasks.id = merger_lines.task_id AND tasks.state IN ('open', 'started', 'testing'))")


class MergerLineLedgerMigration(Migration):
    """A merger line about a worker records the wait and the task of the ask, how and when it ended, when an
    answer is due, when it is forwarded to the main agent and how often a merger read it. Lines that exist are closed as moot,
    except the line of a worker that still waits for its answer, which gets its times from the upgrade."""

    number = 63
    statements = (
        "ALTER TABLE merger_lines ADD COLUMN wait_id INTEGER",
        "ALTER TABLE merger_lines ADD COLUMN task_id INTEGER",
        "ALTER TABLE merger_lines ADD COLUMN outcome TEXT",
        "ALTER TABLE merger_lines ADD COLUMN closed_at TEXT",
        "ALTER TABLE merger_lines ADD COLUMN due_at TEXT",
        "ALTER TABLE merger_lines ADD COLUMN forward_at TEXT",
        "ALTER TABLE merger_lines ADD COLUMN visit_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE merger_lines ADD COLUMN source_key TEXT",
        "UPDATE merger_lines SET task_id = json_extract(facts_json, '$.task') WHERE worker_id IS NOT NULL AND facts_json IS NOT NULL",
        "UPDATE merger_lines SET wait_id = (" + QUESTION_WAIT_SQL + "),"
        " due_at = " + UPGRADE_TIME.format(shift=f", '+{UPGRADE_ANSWER_MINUTES} minutes'") + ","
        " forward_at = " + UPGRADE_TIME.format(shift=f", '+{UPGRADE_FORWARD_MINUTES} minutes'") + " WHERE " + ACTIVE_QUESTION_SQL,
        "UPDATE merger_lines SET outcome = 'moot', closed_at = " + UPGRADE_TIME.format(shift="") + " WHERE worker_id IS NOT NULL AND wait_id IS NULL",
    )
