COMMENTED_ROW_SELECT = (
    "COALESCE(json_extract(metadata, '$.\"journal.core.messages\".commented_row.model') || ':' || json_extract(metadata, '$.\"journal.core.messages\".commented_row.id'),"
    " (SELECT target_model || ':' || target_id FROM links WHERE source_model = 'message' AND source_id = messages.id"
    " AND link_type = 'comments_on' ORDER BY id LIMIT 1), '') AS commented_row"
)
CHAT_MESSAGES_SELECT = (f"SELECT id, environment_id, parent_id, type, text, read_at, files, captions, reactions, flowchart_edges, peer, recipient, {COMMENTED_ROW_SELECT}, session_agent_id, target_agent_id, created_at FROM messages"
    " WHERE is_chat_visible = 1")

MAIN_CHAT_MARKS_SELECT = (
    "SELECT id, environment_id, session_agent_id, type, variant, key AS mark_key, text, detail, lines, target_model, target_id, outcome, figure, fraction, run_key, run_step, state, ended_at, created_at"
    " FROM chat_marks"
    " WHERE session_agent_id IS NULL OR session_agent_id IN (SELECT id FROM agents WHERE role = 'main')"
)

ATTACHED_FILES_SELECT = (
    "SELECT messages.id || ':' || file.key AS row_key, messages.id AS message_id, messages.environment_id AS environment_id, file.value AS name, messages.text AS message_text, messages.created_at AS created_at"
    " FROM messages, json_each(messages.files) AS file"
)
