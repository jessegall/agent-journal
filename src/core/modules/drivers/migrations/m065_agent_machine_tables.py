from engine.database.migration import Migration

ROW_COLUMNS = ("version INTEGER NOT NULL DEFAULT 1, metadata TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata)), created_at TEXT NOT NULL,"
               " updated_at TEXT NOT NULL")
AGENT = "session_agent_id INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE"
TABLES = {
    "agent_stacks": f"{AGENT}, driver_name TEXT NOT NULL, table_digest TEXT NOT NULL, pinned_slices TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(pinned_slices)),"
                    " frame_schema INTEGER NOT NULL DEFAULT 1, frames TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(frames)), stop_refusals INTEGER NOT NULL DEFAULT 0,"
                    " tool_refusals INTEGER NOT NULL DEFAULT 0",
    "agent_stack_moves": f"{AGENT}, move_type TEXT NOT NULL, frame_key TEXT NOT NULL, reason_text TEXT NOT NULL, version_before INTEGER NOT NULL,"
                         " version_after INTEGER NOT NULL, step_cause TEXT NOT NULL, hook_call_id INTEGER, frame_end TEXT, actor_id INTEGER",
    "agent_subjects": f"{AGENT}, subject_model TEXT NOT NULL, subject_id INTEGER NOT NULL, frame_key TEXT NOT NULL, generation TEXT NOT NULL",
    "agent_frame_suppressions": f"{AGENT}, need_key TEXT NOT NULL, person_id INTEGER NOT NULL REFERENCES actors(id) ON DELETE RESTRICT, reason TEXT NOT NULL,"
                                " ended_at TEXT",
    "agent_escalations": f"{AGENT}, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE, escalation_type TEXT NOT NULL,"
                         " responder TEXT NOT NULL, refusal_count INTEGER NOT NULL, block_ids TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(block_ids)),"
                         " work_keys TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(work_keys)), state TEXT NOT NULL DEFAULT 'open', answer TEXT NOT NULL DEFAULT '',"
                         " ended_at TEXT",
    "agent_wakes": f"{AGENT}, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE, work_generation TEXT NOT NULL,"
                   " session_generation INTEGER NOT NULL, causes TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(causes)),"
                   " lines TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(lines)), state TEXT NOT NULL DEFAULT 'open', transport TEXT NOT NULL DEFAULT '',"
                   " lease_ends_at TEXT, attempts INTEGER NOT NULL DEFAULT 0, next_attempt_at TEXT, failure TEXT NOT NULL DEFAULT '', acknowledged_at TEXT",
    "agent_step_requests": f"{AGENT}, causes TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(causes)), attempts INTEGER NOT NULL DEFAULT 0, served_at TEXT",
    "agent_launches": f"{AGENT}, attempt INTEGER NOT NULL, session_generation INTEGER NOT NULL, requested_at TEXT NOT NULL, launched_at TEXT, first_hook_at TEXT,"
                      " failed_at TEXT, failure TEXT NOT NULL DEFAULT '', can_retry INTEGER NOT NULL DEFAULT 1, helper_job_id INTEGER",
    "driver_tables": "driver_name TEXT NOT NULL, digest TEXT NOT NULL, compiled_at TEXT NOT NULL, manifest TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(manifest))",
    "driver_epochs": "environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE, epoch INTEGER NOT NULL DEFAULT 0",
    "program_epochs": "program TEXT NOT NULL, epoch INTEGER NOT NULL DEFAULT 0",
    "driver_grants": f"{AGENT}, environment_id INTEGER NOT NULL REFERENCES environments(id) ON DELETE CASCADE, grant_type TEXT NOT NULL, policy_key TEXT NOT NULL,"
                     " target TEXT NOT NULL, action_fingerprint TEXT NOT NULL, asker_id INTEGER NOT NULL, reason TEXT NOT NULL, grant_state TEXT NOT NULL DEFAULT 'held',"
                     " responder_id INTEGER, tried TEXT NOT NULL DEFAULT '', expires_at TEXT, spending_firing TEXT NOT NULL DEFAULT ''",
    "admission_receipts": f"{AGENT}, firing TEXT NOT NULL, command_fingerprint TEXT NOT NULL, policy_key TEXT NOT NULL, grant_id INTEGER NOT NULL, consumed_at TEXT",
    "driver_comparisons": f"{AGENT}, slice_name TEXT NOT NULL, event_text TEXT NOT NULL, old_answer TEXT NOT NULL, new_answer TEXT NOT NULL, hook_call_id INTEGER,"
                          " difference_key TEXT NOT NULL DEFAULT '', difference_state TEXT NOT NULL DEFAULT 'unexplained', is_replayable INTEGER NOT NULL DEFAULT 1",
    "driver_comparison_stacks": f"{AGENT}, frames TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(frames)), plans TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(plans)),"
                                " stop_refusals INTEGER NOT NULL DEFAULT 0, tool_refusals INTEGER NOT NULL DEFAULT 0",
}
INDEXES = [
    "CREATE UNIQUE INDEX agent_stacks_agent ON agent_stacks (session_agent_id)",
    "CREATE INDEX agent_stack_moves_agent ON agent_stack_moves (session_agent_id, id)",
    "CREATE INDEX agent_subjects_agent ON agent_subjects (session_agent_id, subject_model, subject_id)",
    "CREATE INDEX agent_subjects_row ON agent_subjects (subject_model, subject_id, session_agent_id)",
    "CREATE INDEX agent_frame_suppressions_open ON agent_frame_suppressions (session_agent_id, need_key) WHERE ended_at IS NULL",
    "CREATE INDEX agent_escalations_open ON agent_escalations (session_agent_id) WHERE state = 'open'",
    "CREATE INDEX agent_escalations_state ON agent_escalations (state, environment_id, created_at)",
    "CREATE INDEX agent_wakes_state ON agent_wakes (state, environment_id)",
    "CREATE INDEX agent_step_requests_unserved ON agent_step_requests (id) WHERE served_at IS NULL",
    "CREATE UNIQUE INDEX agent_wakes_active ON agent_wakes (session_agent_id, work_generation) WHERE state NOT IN ('acknowledged', 'cancelled', 'expired')",
    "CREATE UNIQUE INDEX agent_step_requests_open ON agent_step_requests (session_agent_id) WHERE served_at IS NULL",
    "CREATE INDEX agent_launches_agent ON agent_launches (session_agent_id, attempt)",
    "CREATE UNIQUE INDEX driver_tables_digest ON driver_tables (driver_name, digest)",
    "CREATE UNIQUE INDEX driver_epochs_environment ON driver_epochs (environment_id)",
    "CREATE UNIQUE INDEX program_epochs_program ON program_epochs (program)",
    "CREATE INDEX driver_grants_agent ON driver_grants (session_agent_id, policy_key, grant_state)",
    "CREATE UNIQUE INDEX admission_receipts_firing ON admission_receipts (session_agent_id, firing, policy_key)",
    "CREATE INDEX driver_comparisons_agent ON driver_comparisons (session_agent_id, id)",
    "CREATE UNIQUE INDEX driver_comparison_stacks_agent ON driver_comparison_stacks (session_agent_id)",
]


class AgentMachineTablesMigration(Migration):
    """Creates the agent machine's tables (doc 1310 section 6.5); no answer reads them until a slice goes live."""

    number = 65
    statements = [*(f"CREATE TABLE {name} (id INTEGER PRIMARY KEY, {columns}, {ROW_COLUMNS}) STRICT" for name, columns in TABLES.items()), *INDEXES]
