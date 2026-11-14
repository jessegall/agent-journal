from tests.stories.core.support.fixtures import UserJoined


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


def test_the_task_overview_reads_its_conversation_through_the_message_and_link_indexes(played):
    story = played(UserJoined)
    story.expect_success('task make "Check plans" --environment main', actor=story.agent)
    database = story.journal.database
    statements = []
    database.connection.set_trace_callback(lambda sql: statements.append(sql) if sql.lstrip().upper().startswith("SELECT") else None)
    try:
        story.expect_success("task overview 1", actor=story.agent)
        story.expect_success("agent cards --show all --environment main", actor=story.user)
    finally:
        database.connection.set_trace_callback(None)
    context = [statement for statement in statements if "WITH RECURSIVE context_seeds" in statement]
    assert context
    for statement in context:
        plan = [row[3] for row in database.connection.execute("EXPLAIN QUERY PLAN " + statement)]
        assert any("messages_environment_parent (environment_id=? AND parent_id=?)" in line for line in plan), plan
        assert any("links_message_source (source_model=? AND source_id=?" in line for line in plan), plan
        assert any("links_message_target (target_model=? AND target_id=?" in line for line in plan), plan
