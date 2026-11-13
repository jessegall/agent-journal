import io
from contextlib import suppress
import os

import pytest

from engine.actor.actor import Actor
from engine.caller.caller import Caller
from engine.caller.caller_request import CallerRequest
from engine.cli.console import Console
from engine.cli.line_run import LineRun
from engine.database.repeated_work import READ_LIMIT_REPEATS, READ_TEXT_LIMIT_REPEATS, SHOWN_CALLS
from engine.database.reported_findings import ReportedFindings
from server.work.listeners.listener_thread import ListenerThread
from server.viewer.line_route import LineRoute
from engine.database.statement import Statement
from engine.query.queries import Queries
from core.modules.chat.models.journal_exception import JournalException
from core.modules.developer.support.developer_settings import REPEATED_WORK_SETTING, TOOLS_SETTING
from core.modules.drivers.bindings.agent_hook_route import AgentHookRoute
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.stories.story_fixture import StoryFixture
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story
from core.modules.developer.support.developer_nudges import EXCEPTION_LINE
from engine.testing.expectations.said_nudge import said

LINES = "agent-line list --agent {agent}"
REPEATED_READ = Statement("SELECT 1")
SHORT_FINDING_LINES = 2 * SHOWN_CALLS + 3


class RepeatedWorkEnabled(StoryFixture):
    parent = UserJoined

    def steps(self, story):
        story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
        story.expect_success(f"setting set {REPEATED_WORK_SETTING} true --project", actor=story.user)


def duplicate_read(database):
    for _ in range(READ_LIMIT_REPEATS + 1):
        database.rows(REPEATED_READ)


def read_rollback(database):
    with suppress(UndoneWrite), database.transaction():
        database.update(Statement("UPDATE settings SET version = version + 1"))
        database.rows(REPEATED_READ)
        raise UndoneWrite()
    database.rows(REPEATED_READ)


class UndoneWrite(Exception):
    """Ends a story's write so its transaction rolls back."""


def looped_read(database):
    for row_id in range(READ_TEXT_LIMIT_REPEATS + 1):
        database.rows(Statement("SELECT ?", [row_id]))


def replace_console_run(monkeypatch, work):
    def run(console, argv, *arguments):
        work(console.events.table.database)
        arguments[-1].write("{}")
        return 0

    monkeypatch.setattr(Console, "run", run)
    monkeypatch.setattr(Console, "requested_run", run)


def run_as_core(story, line_run=None):
    return (line_run or LineRun(story.home)).run_as(["task", "list"], lambda container: Caller(Actor.core()), io.StringIO())


def run_direct(story, line_run=None):
    request = CallerRequest(dict(os.environ), os.getcwd(), os.getpid())
    return (line_run or LineRun(story.home)).run(["task", "list"], request, io.StringIO())


def reported(story) -> list[str]:
    return [row.message for row in story.container.get(Queries).query(JournalException).take(20) if "RepeatedCallsError" in row.message]


@pytest.mark.parametrize("start", [run_as_core, run_direct])
def test_with_the_setting_on_a_duplicate_query_in_a_request_is_reported_and_the_request_finishes(new_story, monkeypatch, start):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, duplicate_read)
    story.expect_rows(start(story) == 0)
    messages = reported(story)
    story.expect_rows(len(messages) == 1, "one request read this more than 1 times: SELECT 1" in messages[0])


@pytest.mark.parametrize("start", [run_as_core, run_direct])
def test_with_the_setting_on_a_query_per_row_in_a_request_is_reported_and_the_request_finishes(new_story, monkeypatch, start):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, looped_read)
    story.expect_rows(start(story) == 0)
    messages = reported(story)
    story.expect_rows(len(messages) == 1, "one request read this SQL more than 10 times: SELECT ?" in messages[0])


def test_a_read_after_a_rolled_back_write_is_not_a_repeated_read(new_story, monkeypatch):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, read_rollback)
    story.expect_rows(run_as_core(story) == 0)
    story.expect_rows(reported(story) == [])


def test_the_report_reaches_the_main_agent_through_its_error_line(new_story, monkeypatch):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, duplicate_read)
    run_as_core(story)
    monkeypatch.undo()
    story.run_listeners()
    story.expect_text(LINES.format(agent=story.agent.id), said(EXCEPTION_LINE))
    story.expect_text("journal-exception show 1", "RepeatedCallsError", actor=story.agent)


@pytest.mark.parametrize("tools,repeated_work", [("on", "false"), ("off", "true")])
def test_with_the_setting_off_nothing_is_reported(new_story, monkeypatch, tools, repeated_work):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting switch {TOOLS_SETTING} {tools} --project", actor=story.user)
    story.expect_success(f"setting set {REPEATED_WORK_SETTING} {repeated_work} --project", actor=story.user)
    replace_console_run(monkeypatch, duplicate_read)
    story.expect_rows(run_as_core(story) == 0)
    story.expect_rows(reported(story) == [])


def test_the_setting_is_off_until_a_person_switches_it_on(new_story, monkeypatch):
    story = new_story(fixture=UserJoined)
    story.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=story.user)
    replace_console_run(monkeypatch, duplicate_read)
    story.expect_rows(run_as_core(story) == 0)
    story.expect_rows(reported(story) == [])


def test_the_same_finding_in_two_requests_is_reported_once(new_story, monkeypatch):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, duplicate_read)
    line_run = LineRun(story.home)
    for _ in range(2):
        run_as_core(story, line_run)
    story.expect_rows(len(reported(story)) == 1)


def repeated_row_read(*row_ids):
    remaining = iter(row_ids)

    def next_row_reads(database):
        row_id = next(remaining)
        for _ in range(READ_LIMIT_REPEATS + 1):
            database.rows(Statement("SELECT ? AS row_id", [row_id]))

    return next_row_reads


def test_the_same_sql_read_for_two_rows_in_two_requests_is_reported_once_with_a_short_text(new_story, monkeypatch):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, repeated_row_read(106281, 106286))
    line_run = LineRun(story.home)
    for _ in range(2):
        run_as_core(story, line_run)
    messages = reported(story)
    story.expect_rows(len(messages) == 1, len(messages[0].splitlines()) <= SHORT_FINDING_LINES, "(106281,)" in messages[0], "(106286,)" not in messages[0])


def test_a_viewer_line_and_a_cli_line_share_the_reported_findings(new_story, monkeypatch):
    story = new_story(fixture=RepeatedWorkEnabled)
    replace_console_run(monkeypatch, repeated_row_read(106281, 106286))
    shared = ReportedFindings()
    viewer_run = LineRoute(story.home, ListenerThread(lambda: None, lambda error: None), shared).line_run
    run_as_core(story, LineRun(story.home, reported=shared))
    run_as_core(story, viewer_run)
    story.expect_rows(viewer_run.reported is shared, len(reported(story)) == 1)


def test_with_the_setting_on_a_duplicate_query_in_a_hook_is_reported_and_the_hook_is_answered(new_story, monkeypatch):
    started = new_story(fixture=RepeatedWorkEnabled)
    answer = AgentHookRoute.answer

    def duplicated_answer(route, event):
        duplicate_read(route.queries.database)
        return answer(route, event)

    monkeypatch.setattr(AgentHookRoute, "answer", duplicated_answer)
    sample = HookSamples.sample("post_tool_use").with_fields(session="s-1", environment="main", firing="repeated-1")
    with server_story(started) as server:
        server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    started.expect_rows(len(reported(started)) == 1)


def test_with_the_setting_off_a_duplicate_query_in_a_hook_is_not_reported(new_story, monkeypatch):
    started = new_story(fixture=UserJoined)
    started.expect_success(f"setting switch {TOOLS_SETTING} on --project", actor=started.user)
    answer = AgentHookRoute.answer

    def duplicated_answer(route, event):
        duplicate_read(route.queries.database)
        return answer(route, event)

    monkeypatch.setattr(AgentHookRoute, "answer", duplicated_answer)
    sample = HookSamples.sample("post_tool_use").with_fields(session="s-1", environment="main", firing="repeated-2")
    with server_story(started) as server:
        server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')
    started.expect_rows(reported(started) == [])
