from engine.database.database import Database
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.core.support.plan_steps import started_plan


def ended_without_its_event(story, table: str, row_id: int, state: str) -> None:
    connection = story.container.get(Database).connection
    for row in connection.execute(f"SELECT name FROM sqlite_master WHERE type = 'trigger' AND tbl_name = '{table}'").fetchall():
        connection.execute(f"DROP TRIGGER {row['name']}")
    connection.execute(f"UPDATE {table} SET state = ? WHERE id = ?", [state, row_id])


def test_the_hourly_sweep_opens_a_task_waiting_on_an_ended_task_and_clears_a_holder_an_open_task_kept(played):
    story = played(UserJoined)
    for title in ("The cart", "The receipt", "The invoice"):
        story.run(f'task make "{title}" --environment main', actor=story.user)
    story.expect_success("task block 2 --on task:1 --environment main", actor=story.user)
    ended_without_its_event(story, "tasks", 1, "completed")
    story.container.get(Database).connection.execute("UPDATE tasks SET holder_id = ? WHERE id = 3", [story.agent.id])
    story.run_tick_handler("task state sweep")
    story.expect_text("task show 2", "state: open", actor=story.user)
    story.expect_absent("task show 3", "holder_id", actor=story.user)
    story.expect_text("task-log list --environment main", "repaired by the state sweep", actor=story.user)


def test_the_hourly_sweep_opens_a_plan_waiting_on_an_ended_plan(played):
    story = played(UserJoined)
    started_plan(story, 1, "Version 5")
    started_plan(story, 2, "Viewer")
    story.expect_success("plan block 2 --on plan:1 --environment main", actor=story.user)
    ended_without_its_event(story, "plans", 1, "completed")
    story.run_tick_handler("plan state sweep")
    story.expect_text("plan show 2", "state: started", actor=story.user)
