from engine.database.migration import Migration

COLUMNS = ("scope_tools INTEGER", "scope_stop INTEGER", "stop_grace_seconds INTEGER NOT NULL DEFAULT 0", "tool_selector TEXT NOT NULL DEFAULT ''",
           "subject_model TEXT NOT NULL DEFAULT ''", "subject_id INTEGER", "members TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(members))",
           "context_generation INTEGER", "condition_schema INTEGER NOT NULL DEFAULT 1", "lifting_lines TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(lifting_lines))",
           "ends TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(ends))", "closer_roles TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(closer_roles))",
           "expires_at TEXT", "judgement TEXT NOT NULL DEFAULT ''", "judgement_reason TEXT NOT NULL DEFAULT ''", "escalation_id INTEGER",
           "opener TEXT NOT NULL DEFAULT ''", "opening_firing TEXT NOT NULL DEFAULT ''", "closed_reason TEXT NOT NULL DEFAULT ''",
           "closer TEXT NOT NULL DEFAULT ''", "closing_evidence TEXT NOT NULL DEFAULT ''")


class AgentBlockScopesMigration(Migration):
    """Gives every block its scopes and the rest of doc 1310 section 4.5, all defaulted, and fills the scopes of the open
    rows from blocks_stop: a stop block refuses the stop only, any other refuses tools only. Old code reads its rows unchanged."""

    number = 66
    statements = [*(f"ALTER TABLE agent_blocks ADD COLUMN {column}" for column in COLUMNS),
                  "UPDATE agent_blocks SET scope_tools = 1 - blocks_stop, scope_stop = blocks_stop WHERE closed_at IS NULL"]
