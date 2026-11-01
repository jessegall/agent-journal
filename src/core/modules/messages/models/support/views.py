CHAT_MESSAGES_SELECT = "SELECT id, environment_id, parent_id, type, text, read_at, files, captions, reactions, created_at FROM messages"

MAIN_CHAT_MARKS_SELECT = (
    "SELECT id, environment_id, agent_id, type, variant, key AS mark_key, text, detail, lines, target_model, target_id, outcome, figure, fraction, run_key, run_step, state, ended_at, created_at"
    " FROM chat_marks"
    " WHERE agent_id IS NULL OR agent_id IN (SELECT id FROM agents WHERE role = 'main')"
)
