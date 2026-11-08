from tests.stories.core.support.coding_fixtures import BuilderWithUser
from tests.stories.server.support.server_client import server_story
from tests.stories.server.window_data_route import window_data


def test_an_open_agent_key_keeps_the_agent_after_it_leaves_the_working_list(new_story):
    story = new_story(fixture=BuilderWithUser)
    agent_id = story.new_row_id("agent start inspect-helper claude helper --environment main")
    story.expect_success(f"agent end {agent_id}")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, keys=f"agents,card.{agent_id}", window="agents.agents", query="environment=main&agents.show=running")
        listed = answer["keys"]["agents"]["value"]["rows"]
        opened = answer["keys"][f"card.{agent_id}"]["value"]["rows"]
        story.expect_rows(status == 200, all(row["id"] != agent_id for row in listed),
                          len(opened) == 1, opened[0]["id"] == agent_id, bool(opened[0]["ended_at"]))


def test_a_worker_with_a_started_and_a_blocked_task_shows_its_current_task(new_story):
    from tests.stories.core.support.coding_fixtures import OrchestratorWithOpenTask
    from tests.stories.suites.coding.modules.workers.support.dispatch_steps import dispatched_worker, repository_environment

    story = new_story(fixture=OrchestratorWithOpenTask)
    repository_environment(story)
    worker = dispatched_worker(story)
    story.expect_success('actor make user "Ada"')
    task = story.new_row_id('task make "Blocked follow-up" --environment main', actor=story.agent)
    story.expect_success(f"task assign {task} --to {worker.id}", actor=story.agent)
    story.expect_success(f"task block {task} --on task:1", actor=story.agent)
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, keys="agents,progress", window="agents.agents")
        card = next(row for row in answer["keys"]["agents"]["value"]["rows"] if row["id"] == worker.id)
        progress = next(row for row in answer["keys"]["progress"]["value"]["rows"] if row["agent_id"] == worker.id)
        story.expect_rows(status == 200, card["facts"]["task_id"] == 1, card["facts"]["state"] != "blocked",
                          any(row["id"] == task and row["state"] == "blocked" for row in card["facts"]["tasks"]), progress["task_id"] == 1)


def test_agent_counts_and_a_page_of_thirty_idle_agents_do_not_read_worktrees_per_agent(new_story):
    story = new_story(fixture=BuilderWithUser)
    for number in range(30):
        agent = story.new_row_id(f"agent start count-{number} claude worker --environment main")
        story.expect_success(f"agent end {agent}")
    with server_story(story) as server:
        cookie = server.expect_viewer_login(server.viewer_key("Ada"))
        status, answer = window_data(server, cookie, keys="limits", window="coding.agent-settings")
        counts = answer["keys"]["limits"]["value"]["rows"]
        worker = next(row for row in counts if row["key"] == "worker")
        story.expect_rows(status == 200, answer["keys"]["limits"]["code"] == 0, worker["kept"] == 30, worker["running"] == 0)
        status, answer = window_data(server, cookie, keys="count-agents", window="coding.agent-settings", query="environment=main&count-agents.role=worker&count-agents.page=1")
        cards = answer["keys"]["count-agents"]
        story.expect_rows(status == 200, cards["code"] == 0, len(cards["value"]["rows"]) == 25, cards["value"]["total"] == 30)
