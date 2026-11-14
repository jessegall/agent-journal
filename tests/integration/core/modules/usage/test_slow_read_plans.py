

def test_conversation_indexes(journal):
    database = journal.database
    cases = [
        ("SELECT id FROM messages WHERE environment_id = 1 AND parent_id = 1", "messages_environment_parent"),
        ("SELECT target_id FROM links WHERE source_model = 'message' AND source_id = 1 AND target_model = 'message' AND link_type = 'comments_on'", "links_message_source"),
        ("SELECT source_id FROM links WHERE target_model = 'message' AND target_id = 1 AND source_model = 'message' AND link_type = 'comments_on'", "links_message_target"),
    ]
    for sql, index in cases:
        plan = [row[3] for row in database.connection.execute("EXPLAIN QUERY PLAN " + sql)]
        assert any((index in line for line in plan)), f'{sql}: {plan}'
