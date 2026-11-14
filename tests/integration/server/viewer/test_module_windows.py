from urllib.parse import urlencode

import pytest

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
