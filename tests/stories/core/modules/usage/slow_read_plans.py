from core.base.database.database import Database
from tests.stories.core.support.fixtures import UserJoined


def test_slow_read_plans(new_story):
    story = new_story(fixture=UserJoined)
    story.expect_success('task make "Check plans" --environment main', actor=story.agent)
    database = story.container.get(Database)
    statements = []
    database.connection.set_trace_callback(lambda sql: statements.append(sql) if sql.lstrip().upper().startswith("SELECT") else None)
    try:
        story.expect_success("task overview 1", actor=story.agent)
        story.expect_success("agent cards --show all --environment main", actor=story.user)
    finally:
        database.connection.set_trace_callback(None)
    context = [statement for statement in statements if "WITH RECURSIVE context_seeds" in statement]
    story.expect_rows(bool(context))
    for statement in context:
        plan = [row[3] for row in database.connection.execute("EXPLAIN QUERY PLAN " + statement)]
        story.expect_rows(any("messages_environment_parent (environment_id=? AND parent_id=?)" in line for line in plan),
                          any("links_message_source (source_model=? AND source_id=?" in line for line in plan),
                          any("links_message_target (target_model=? AND target_id=?" in line for line in plan))


def test_conversation_indexes(new_story):
    story = new_story(fixture=UserJoined)
    database = story.container.get(Database)
    cases = [
        ("SELECT id FROM messages WHERE environment_id = 1 AND parent_id = 1", "messages_environment_parent"),
        ("SELECT target_id FROM links WHERE source_model = 'message' AND source_id = 1 AND target_model = 'message' AND link_type = 'comments_on'", "links_message_source"),
        ("SELECT source_id FROM links WHERE target_model = 'message' AND target_id = 1 AND source_model = 'message' AND link_type = 'comments_on'", "links_message_target"),
    ]
    for sql, index in cases:
        plan = [row[3] for row in database.connection.execute("EXPLAIN QUERY PLAN " + sql)]
        story.expect_rows(any(index in line for line in plan), detail=f"{sql}: {plan}")
