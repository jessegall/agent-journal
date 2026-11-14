import json
from unittest.mock import patch

import pytest

from engine.database.database import Database
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import viewer_answer

SHELL_LINES = [["environment", "list"], ["environment", "show", "1"], ["agent", "list"], ["setting", "list"], ["template", "list"]]


def shell_batch(lines: list[list[str]]) -> dict[str, object]:
    return {"lines": [{"window": "viewer.shell", "line": line, "environment": "main"} for line in lines]}


@pytest.fixture
def batch_server(journal):
    user = journal.make_user()
    with integration_server(journal, listener_thread_started=False) as server:
        yield server, server.expect_viewer_login(server.viewer_key("Ada")), user


def test_a_line_that_names_no_window_is_refused(person_server):
    server, cookie, _ = person_server
    server.expect_viewer_line(cookie, {"line": ["environment", "list"], "environment": "main"}, 400, "every line names the window that sends it")


def test_a_line_outside_the_windows_declaration_is_refused(person_server):
    server, cookie, _ = person_server
    server.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["secret", "list"], "environment": "main"}, 200, '"code": 1')


def test_an_abbreviated_flag_is_a_usage_error(person_server):
    server, cookie, _ = person_server
    server.expect_viewer_line(cookie, {"window": "viewer.shell", "line": ["environment", "list", "--js"], "environment": "main"}, 200, '"code": 2')


def test_a_line_with_words_after_a_flag_separator_keeps_them_as_words(person_server):
    server, cookie, _ = person_server
    body = {"window": "triggers.triggers", "line": ["trigger", "make", "--do", "deny", "--", "--force", "Never force push"], "environment": "main"}
    server.expect_viewer_line(cookie, body, 200, '"code": 0')


def test_a_write_from_a_window_is_recorded_as_the_person_at_the_viewer(person_server):
    server, cookie, user = person_server
    body = {"window": "viewer.shell", "line": ["setting", "make", "viewer.window.shell.compact", "true"], "environment": "main"}
    server.expect_viewer_line(cookie, body, 200, f'"creator_id": {user.id}')


def test_several_lines_in_one_request_are_answered_in_order_each_checked_on_its_own(person_server):
    server, cookie, _ = person_server
    status, _, answer = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", shell_batch([["environment", "list"], ["secret", "list"], ["environment", "list", "--js"]]))
    assert status == 200 and [item["code"] for item in json.loads(answer)["answers"]] == [0, 1, 2], answer


def test_a_lines_request_without_its_list_is_refused(person_server):
    server, cookie, _ = person_server
    status, _, answer = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", {"line": ["environment", "list"]})
    assert status == 400 and "a list of lines" in answer, answer


def test_five_viewer_reads_open_one_database_and_read_one_registry_row(batch_server):
    server, cookie, _ = batch_server
    databases = []
    open_database = Database.opened

    def recorded(home, *turns):
        database = open_database(home, *turns)
        databases.append(database)
        return database

    with patch.object(Database, "opened", side_effect=recorded):
        status, _, text = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", shell_batch(SHELL_LINES))
    registry_reads = sum(count for database in databases for sql, count in database.repeated_work.points().statements.items() if "FROM registry" in sql)
    assert status == 200 and [answer["code"] for answer in json.loads(text)["answers"]] == [0] * 5, text
    assert len(databases) == 1 and registry_reads == 1, (len(databases), registry_reads)


def test_refused_and_invalid_lines_leave_the_other_batch_answers_intact(batch_server):
    server, cookie, _ = batch_server
    lines = [["environment", "list"], ["secret", "list"], ["environment", "show", "1"], ["environment", "list", "--js"], ["agent", "list"]]
    status, _, text = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", shell_batch(lines))
    assert status == 200 and [answer["code"] for answer in json.loads(text)["answers"]] == [0, 1, 0, 2, 0], text


def test_a_batch_write_keeps_its_own_connection_and_the_following_read_sees_it(batch_server):
    server, cookie, user = batch_server
    lines = [["setting", "list"], ["setting", "make", "viewer.window.shell.compact", "true"], ["setting", "show", "viewer.window.shell.compact"]]
    with patch.object(Database, "opened", wraps=Database.opened) as opened:
        status, _, text = viewer_answer(server.viewer_port(), "/api/lines", cookie, "", shell_batch(lines))
    answers = json.loads(text)["answers"]
    assert status == 200 and [answer["code"] for answer in answers] == [0, 0, 0], text
    assert opened.call_count == 2
    assert answers[1]["value"]["creator_id"] == user.id and answers[2]["value"]["value"] is True
