import json
from unittest.mock import patch

import pytest

from core.base.database.database import Database
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story, viewer_answer
from tests.stories.support.story_checks import expect_value


@pytest.fixture
def batch_server(new_story):
    with server_story(new_story(fixture=UserJoined), listener_thread_started=False) as story:
        yield story


def test_five_viewer_reads_open_one_database_and_read_one_registry_row(batch_server):
    story = batch_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    port = story.viewer_port()
    lines = [["environment", "list"], ["environment", "show", "1"], ["agent", "list"], ["setting", "list"], ["template", "list"]]
    databases = []
    statements = []
    open_database = Database.opened

    def recorded(home):
        database = open_database(home)
        database.connection.set_trace_callback(statements.append)
        databases.append(database)
        return database

    with patch.object(Database, "opened", side_effect=recorded):
        status, _, text = viewer_answer(port, "/api/lines", cookie, "", {"lines": [
            {"window": "viewer.shell", "line": line, "environment": "main"} for line in lines]})
    answers = json.loads(text)["answers"]
    registry_reads = sum(count for database in databases for sql, count in database.repeated_work.points().statements.items() if "FROM registry" in sql)
    points = sum(database.repeated_work.points().total for database in databases)
    print(f"five viewer reads: {len(databases)} connections, {registry_reads} registry rows, {points} points, {len(statements)} statements")
    expect_value(status, 200)
    expect_value([answer["code"] for answer in answers], [0] * 5)
    expect_value(len(databases), 1)
    expect_value(registry_reads, 1)


def test_refused_and_invalid_lines_leave_the_other_batch_answers_intact(batch_server):
    story = batch_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    lines = [["environment", "list"], ["secret", "list"], ["environment", "show", "1"],
             ["environment", "list", "--js"], ["agent", "list"]]
    status, _, text = viewer_answer(story.viewer_port(), "/api/lines", cookie, "", {"lines": [
        {"window": "viewer.shell", "line": line, "environment": "main"} for line in lines]})
    answers = json.loads(text)["answers"]
    expect_value(status, 200)
    expect_value([answer["code"] for answer in answers], [0, 1, 0, 2, 0])


def test_a_batch_write_keeps_its_own_connection_and_the_following_read_sees_it(batch_server):
    story = batch_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    port = story.viewer_port()
    lines = [["setting", "list"], ["setting", "make", "viewer.window.shell.compact", "true"],
             ["setting", "show", "viewer.window.shell.compact"]]
    with patch.object(Database, "opened", wraps=Database.opened) as opened:
        status, _, text = viewer_answer(port, "/api/lines", cookie, "", {"lines": [
            {"window": "viewer.shell", "line": line, "environment": "main"} for line in lines]})
    answers = json.loads(text)["answers"]
    expect_value(status, 200)
    expect_value([answer["code"] for answer in answers], [0, 0, 0])
    expect_value(opened.call_count, 2)
    expect_value(answers[1]["value"]["creator_id"], story.story.user.id)
    expect_value(answers[2]["value"]["value"], True)
