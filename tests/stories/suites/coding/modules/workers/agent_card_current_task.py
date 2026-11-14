from tests.stories.core.support.agent_labels import agent_number
from tests.stories.server.support.server_client import server_story


def test_a_worker_with_a_started_and_a_blocked_task_shows_its_current_task(new_story):
    from tests.stories.core.support.coding_fixtures import OpenTaskOrchestrator
    from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

    story = new_story(fixture=OpenTaskOrchestrator)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('actor make user "Ada"')
    task = story.new_row_id('task make "Blocked follow-up" --environment main', actor=story.agent)
    story.expect_success(f"task assign {task} --to {agent_number(story, worker.id)}", actor=story.agent)
    story.expect_success(f"task block {task} --on task:1", actor=story.agent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = server.window_data(cookie, keys="agents,progress", window="agents.agents")
        card = next(row for row in answer["keys"]["agents"]["value"]["rows"] if row["id"] == worker.id)
        progress = next(row for row in answer["keys"]["progress"]["value"]["rows"] if row["agent_id"] == worker.id)
        story.expect_rows(status == 200, card["facts"]["task_id"] == 1, card["facts"]["state"] != "blocked",
                          any(row["id"] == task and row["state"] == "blocked" for row in card["facts"]["tasks"]), progress["task_id"] == 1)
