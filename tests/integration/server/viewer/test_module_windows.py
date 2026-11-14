from urllib.parse import urlencode

import pytest

from engine.actor.actor import Actor
from engine.enums.actor_type import ActorType
from tests.integration.support.integration_server import integration_server

SESSION = "s-1"


# a user, Ada, logged in to the viewer, beside a main agent that read its overview
@pytest.fixture
def viewer(journal):
    user = journal.make_user()
    with integration_server(journal) as server:
        server.start_agent(SESSION)
        assert server.run_as("overview", SESSION).exit_code == 0
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user


def agent_line(server, line: str) -> None:
    answer = server.run_as(line, SESSION)
    assert answer.exit_code == 0, (line, answer)


def test_search_window_reads_all_words_and_the_selected_model_through_its_key(viewer):
    server, cookie, _ = viewer
    agent_line(server, 'task make "Fix the cart" --brief "totals in cents"')
    query = urlencode({"environment": "main", "results.terms": "cart cents", "results.model": "task"})
    status, answer = server.window_data(cookie, keys="results", window="search.search", query=query)
    results = answer["keys"]["results"]
    assert status == 200 and results["code"] == 0 and results["value"]["total"] == 1, results
    assert results["value"]["hits"][0]["cli_name"] == "task"


def test_sequences_window_reads_sequences_and_runs_together(viewer):
    server, cookie, user = viewer
    assert server.journal.run('sequence make "Release" --steps "Run the suite | Tag the release"', user).code == 0
    agent_line(server, "sequence run 1")
    status, answer = server.window_data(cookie, window="sequences.sequences")
    board = answer["keys"]["board"]
    assert status == 200 and board["code"] == 0, board
    assert board["value"]["rows"][0]["title"] == "Release" and board["value"]["runs"][0]["sequence_id"] == 1


def test_secrets_window_reads_the_secrets_and_none_that_was_deleted(viewer):
    server, cookie, user = viewer
    agent_line(server, 'secret make "Github"')
    agent_line(server, 'secret make "Old key"')
    assert server.journal.run("secret delete 2", user).code == 0
    status, answer = server.window_data(cookie, window="secrets.secrets")
    secrets = answer["keys"]["secrets"]
    assert status == 200 and secrets["code"] == 0 and [row["title"] for row in secrets["value"]["rows"]] == ["Github"], secrets


def test_the_tasks_window_reads_its_visible_tab_and_requests_plan_places_on_demand(viewer):
    server, cookie, _ = viewer
    journal = server.journal
    assert journal.run('plan make "Version 5 core" --environment main').code == 0
    for title in ("Values", "Models", "Queries"):
        assert journal.run(f'phase make --plan 1 "{title}" --goal "{title.lower()} pass their tests"').code == 0
    for task_id, title in enumerate(("First", "Second", "Third"), 1):
        assert journal.run(f'task make "{title}" --brief "A task in the phase" --environment main').code == 0
        assert journal.run(f"phase place {task_id} --phase 1").code == 0
    status, listed = server.window_data(cookie, window="tasks.tasks", query="environment=main&tab=list&board.limit=1")
    assert status == 200 and set(listed["keys"]) == {"board", "tags"} and all(outcome["code"] == 0 for outcome in listed["keys"].values()), listed
    status, graph = server.window_data(cookie, window="tasks.tasks", query="environment=main&tab=graph")
    assert status == 200 and set(graph["keys"]) == {"graph"} and graph["keys"]["graph"]["code"] == 0, graph
    status, places = server.window_data(cookie, keys="places", window="tasks.tasks")
    rows = places["keys"]["places"]["value"]["rows"]
    assert status == 200 and set(places["keys"]) == {"places"} and len(rows) == 3, places
    assert rows[0]["label"] == "Plan 1: Version 5 core › Values" and rows[0]["task_ids"] == [1, 2, 3], rows[0]


def test_memories_window_reads_filtered_rows_through_keys_and_has_no_counts_key(viewer):
    server, cookie, _ = viewer
    agent_line(server, 'memory make "The cart keeps totals in cents" --environment main')
    worker = server.journal.new_row_id("agent start s-9 claude worker --environment main")
    assert server.journal.run('memory make "The worker reads the cart" --environment main', Actor(worker, ActorType.AGENT)).code == 0
    status, counts = server.window_data(cookie, window="memories.memories")
    assert status == 200 and "counts" not in counts["keys"]
    query = "environment=main&memories.main-agent=true&memories.environment=main&memories.state=active&memories.limit=20"
    status, listed = server.window_data(cookie, keys="memories", window="memories.memories", query=query)
    assert status == 200 and listed["keys"]["memories"]["code"] == 0 and listed["keys"]["memories"]["value"]["total"] == 1, listed
    query = "environment=main&memories.other-agents=true&memories.environment=main&memories.limit=20"
    status, listed = server.window_data(cookie, keys="memories", window="memories.memories", query=query)
    assert status == 200 and listed["keys"]["memories"]["code"] == 0 and listed["keys"]["memories"]["value"]["agents"][0]["agent_id"] == worker, listed


def test_agent_counts_and_a_page_of_thirty_idle_agents_do_not_read_worktrees_per_agent(viewer):
    server, cookie, _ = viewer
    for number in range(30):
        agent = server.journal.new_row_id(f"agent start count-{number} claude worker --environment main")
        assert server.journal.run(f"agent end {agent}").code == 0
    status, answer = server.window_data(cookie, keys="limits", window="coding.agent-settings")
    worker = next(row for row in answer["keys"]["limits"]["value"]["rows"] if row["key"] == "worker")
    assert status == 200 and answer["keys"]["limits"]["code"] == 0 and (worker["kept"], worker["running"]) == (30, 0), worker
    status, answer = server.window_data(cookie, keys="count-agents", window="coding.agent-settings", query="environment=main&count-agents.role=worker&count-agents.page=1")
    cards = answer["keys"]["count-agents"]
    assert status == 200 and cards["code"] == 0 and len(cards["value"]["rows"]) == 25 and cards["value"]["total"] == 30, cards
