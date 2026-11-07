from core.base.database.database import Database
from tests.stories.core.support.fixtures import UserJoined


def test_a_task_holding_a_state_no_enum_knows_loads_and_shows(new_story):
    story = new_story(fixture=UserJoined)
    story.run('task make "Fix the cart" --environment main', actor=story.agent)
    connection = story.container.get(Database).connection
    for row in connection.execute("SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = 'tasks' AND sql LIKE '%no move of a task%'").fetchall():
        connection.execute(f"DROP TRIGGER {row['name']}")
    connection.execute("UPDATE tasks SET state = 'reviewing' WHERE id = 1")
    story.expect_text("task show 1", "state: reviewing", actor=story.user)
    story.expect_text("task list", "Fix the cart", actor=story.user)
