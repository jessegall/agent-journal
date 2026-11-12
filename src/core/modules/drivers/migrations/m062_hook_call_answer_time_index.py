from engine.database.migration import Migration


class HookCallAnswerTimeIndexMigration(Migration):
    """Indexes the hook calls of an agent by answer and time, which a refusal skip reads to learn whether another
    rule refused since the last skip."""

    number = 62
    statements = ["CREATE INDEX IF NOT EXISTS hook_calls_session_answer_created ON hook_calls (session_agent_id, answer, created_at)"]
