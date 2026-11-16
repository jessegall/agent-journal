from datetime import timedelta
from tests.stories.core.modules.developer.support.hook_recording_fixture import HookRecordingEnabled
from core.modules.developer.support.developer_settings import HOOK_REQUEST_LOG_SIZE_SETTING
import json
import sqlite3
from concurrent.futures import ThreadPoolExecutor
from threading import Event

import pytest

from core.modules.agents.models.agent import Agent
from core.modules.developer.support.developer_settings import HOOK_DURATIONS_SETTING, HOOK_REQUEST_LOG_SETTING, TOOLS_SETTING
from core.modules.developer.support.hook_request_log import HookRequestLog
from engine.enums.command_category import CommandCategory
from engine.enums.hook_answer import HookAnswer
from engine.query.queries import Queries
from engine.testing.examples.hook_samples import HookSamples
from engine.testing.examples.shell_part import ShellPart
from engine.testing.stories.hook_priorities import AGENT_HOOK_PRIORITY, MAIN_AGENT_HOOK_PRIORITY
from engine.time.polled_wait import PolledWait
from server.endpoints.cli_endpoint import CliEndpoint
from server.viewer.windows_route import WindowsRoute
from server.work.rounds.journal_round import JournalRound
from server.work.rounds.per_round_container import PerRoundContainer
from server.work.rounds.round_work import RoundWork
from tests.integration.support.integration_server import integration_server
from tests.integration.support.server_harness import viewer_answer

WAIT_SECONDS = 2
POLL_SECONDS = 0.01
ROUND_START_LIMIT_SECONDS = 10
SESSION = "s-1"
QUEUE_LIST = {"line": ["queue", "list"], "environment": "main", "window": "developer.hook-requests"}
HOOK_REQUESTS = {"line": ["developer", "hook-requests"], "environment": "main", "window": "developer.hook-requests"}
TASK_LIST = {"line": ["task", "list"], "environment": "main", "window": "tasks.tasks"}


@pytest.fixture
def recording_server(journal):
    journal.make_user()
    with integration_server(journal) as server:
        server.start_agent(SESSION)
        assert server.run_as("overview", SESSION).exit_code == 0
        for line in (f"setting switch {TOOLS_SETTING} on --project", f"setting set {HOOK_REQUEST_LOG_SETTING} true --project", f"setting set {HOOK_DURATIONS_SETTING} true --project"):
            server.expect_cli_exit(line, "/", 0, "")
        yield server


class BlockedRound(RoundWork):
    """Stands in for a slow plugin script or program stop: its round runs until the test releases it."""

    def __init__(self) -> None:
        self.entered, self.release = Event(), Event()

    def run(self, container) -> None:
        self.entered.set()
        self.release.wait(10)


def login(server) -> str:
    return server.expect_viewer_login(server.viewer_key("Ada"))


def hook_rows(server, cookie: str, *flags: str) -> list[dict[str, object]]:
    return server.viewer_line_value(cookie, {**HOOK_REQUESTS, "line": [*HOOK_REQUESTS["line"], *flags]})["rows"]


def post_hook(server, sample) -> None:
    server.expect_hook_answer("/hook", dict(sample.body), 200, '"refusal":')


def instant_lane(server, cookie) -> dict[str, object]:
    return next(lane for lane in server.viewer_line_value(cookie, QUEUE_LIST)["execution"]["lanes"] if lane["lane"] == "instant")


def waiting_entries(server, count: int) -> bool:
    return PolledWait(WAIT_SECONDS, POLL_SECONDS).poll(lambda: sum(not entry.is_running for entry in server.context.hook_database.executions.read()) >= count)


def running_lines(server, cookie) -> list[str]:
    return [entry["line"] for entry in instant_lane(server, cookie)["running"]]


def started_worker(journal, session: str) -> int:
    return journal.new_row_id(f"agent start {session} claude worker --environment main")


@pytest.mark.parametrize("tools,recording,visible", [("on", "true", True), ("on", "false", False), ("off", "true", False), ("off", "false", False)])
def test_hook_navigation_requires_both_developer_tools_and_recording(recording_server, tools, recording, visible):
    server = recording_server
    cookie = login(server)
    for line in (["setting", "switch", TOOLS_SETTING, tools, "--project"], ["setting", "set", HOOK_REQUEST_LOG_SETTING, recording, "--project"]):
        server.viewer_line_value(cookie, {"line": line, "environment": "main", "window": "settings.settings"})
    status, body, _ = server.viewer_download("/api/windows?environment=main", cookie)
    assert status == 200
    windows = json.loads(body)["windows"]
    assert ('"developer.hook-requests"' in body.decode()) is visible
    assert ('"developer.numbers"' in body.decode()) is (tools == "on")
    assert all(window["group"] == "developer" for window in windows if window["name"].startswith("developer."))


@pytest.mark.parametrize("event,outcome", [("post_tool_use", HookAnswer.ALLOWED), ("stop", HookAnswer.REFUSED)])
def test_completed_hook_requests_record_the_real_duration_and_decision(recording_server, event, outcome):
    server = recording_server
    if outcome is HookAnswer.REFUSED:
        assert server.run_as('task make "Fix the cart" --brief "Correct the cart total"', SESSION).exit_code == 0
        assert server.run_as("task start 1", SESSION).exit_code == 0
    sample = HookSamples.sample(event).with_fields(session=SESSION, environment="main", event_id=f"record-{event}")
    post_hook(server, sample)
    request = hook_rows(server, login(server))[0]
    assert request["duration_ms"] > 0
    assert request["outcome"] == outcome.value and request["body"] == dict(sample.body), request


def test_a_disabled_hook_log_loads_no_agent_rows(recording_server, monkeypatch):
    server = recording_server
    assert server.journal.run(f"setting set {HOOK_REQUEST_LOG_SETTING} false --project").code == 0
    costs = []
    record_hook = HookRequestLog.record_hook

    def record_counted(log, *args):
        points_counter = log.queries.database.repeated_work
        first_points = points_counter.points()
        recorded = record_hook(log, *args)
        costs.append(points_counter.points().minus(first_points))
        return recorded

    monkeypatch.setattr(HookRequestLog, "record_hook", record_counted)
    post_hook(server, HookSamples.sample("post_tool_use").with_fields(session=SESSION, environment="main", event_id="unrecorded"))
    assert len(costs) == 1 and costs[0].tables["agents"] == 0
    assert not server.journal.container.get(HookRequestLog).read()


def test_a_locked_hook_log_counts_the_dropped_row_without_a_warning(recording_server, monkeypatch):
    server = recording_server
    record_hook = HookRequestLog.record_hook

    def locked_record(log, *args):
        connection = sqlite3.connect(server.journal.home.database, timeout=0, autocommit=True)
        try:
            connection.execute("BEGIN IMMEDIATE")
            return record_hook(log, *args)
        finally:
            connection.execute("ROLLBACK")
            connection.close()

    monkeypatch.setattr(HookRequestLog, "record_hook", locked_record)
    previous_count = server.context.request_trace.counts["dropped"]
    post_hook(server, HookSamples.sample("post_tool_use").with_fields(session=SESSION, environment="main", event_id="locked-log"))
    assert server.context.request_trace.counts["dropped"] == previous_count + 1
    log = server.journal.home.system_log
    assert not log.exists() or "request recording failed: database is locked" not in log.read_text()


def test_a_hook_request_counts_the_parts_of_its_command_chain(recording_server):
    server = recording_server
    parts = [ShellPart("git", CommandCategory.VERSION_CONTROL, ["status"]), ShellPart("ls", CommandCategory.READ, [])]
    post_hook(server, HookSamples.shell("git status && ls", *parts).with_fields(session=SESSION, environment="main", event_id="record-chain"))
    post_hook(server, HookSamples.sample("stop").with_fields(session=SESSION, environment="main", event_id="record-stop"))
    assert [row["part_count"] for row in hook_rows(server, login(server))] == [0, 2]


def test_requests_show_the_sender_and_queue_time(recording_server):
    server = recording_server
    worker = started_worker(server.journal, "s-worker")
    number = server.journal.container.get(Queries).query(Agent).find(worker).number
    assert server.journal.run(f'agent edit {number} --given-name "Ada"').code == 0
    for session, role in ((SESSION, "main"), ("s-worker", "worker")):
        post_hook(server, HookSamples.sample("post_tool_use").with_fields(session=session, role=role, event_id=f"sender-{role}"))
    cookie = login(server)
    server.viewer_line_value(cookie, TASK_LIST)
    server.expect_cli_exit("task list", "/", 0, "")
    server.journal.run_tick("request trace import")
    server.journal.run_tick("request trace import")
    rows = [row for row in hook_rows(server, cookie) if not str(row["event"]).startswith("setting ")]
    assert [row["sender"] for row in rows[:4]] == ["Command line", "Viewer", f"Worker {worker}", "Main agent"], rows[:4]
    assert rows[2]["agent_id"] == worker
    assert [row["event"] for row in rows[:2]] == ["task list", "task list"]
    assert all(row["queued_ms"] >= 0 for row in rows[:4]) and rows[0]["queued_ms"] > 0


def test_request_filters_apply_on_the_viewer_route(recording_server):
    server = recording_server
    log = server.journal.container.get(HookRequestLog)
    for role, event in (("main", "stop"), ("main", "process part-start"), ("viewer", "task list"), ("cli", "agent list")):
        log.record("claude", {}, {"event": event}, 1, HookAnswer.ALLOWED, role=role)
    cookie = login(server)

    def events(*flags):
        return [row["event"] for row in hook_rows(server, cookie, *flags)]

    assert events() == ["agent list", "task list", "stop"]
    assert events("--family", "process bookkeeping") == ["process part-start"]
    assert events("--kind", "viewer", "--family", "task") == ["task list"]
    assert events("--sender", "Main agent") == ["stop"]
    assert events("--kind", "viewer", "--sender", "Main agent") == []


def test_a_hook_shows_the_time_it_waited_for_another(recording_server):
    server = recording_server
    started_worker(server.journal, "s-queued-worker")
    sample = HookSamples.sample("post_tool_use").with_fields(session="s-queued-worker", event_id="queued")
    with ThreadPoolExecutor(1) as pool:
        with server.context.hook_database.used(AGENT_HOOK_PRIORITY, 1):
            answer = pool.submit(post_hook, server, sample)
            assert waiting_entries(server, 1)
        answer.result()
    assert hook_rows(server, login(server))[0]["queued_ms"] > 0


def test_recording_drops_requests_instead_of_waiting_for_a_writer(recording_server):
    server = recording_server
    cookie = login(server)
    writer = sqlite3.connect(server.journal.home.database, timeout=0)
    writer.execute("BEGIN IMMEDIATE")
    try:
        server.viewer_line_value(cookie, TASK_LIST)
        server.expect_cli_exit("task list", "/", 0, "")
    finally:
        writer.rollback()
        writer.close()
    assert not any(row["event"] == "task list" for row in hook_rows(server, cookie))


def test_the_executions_show_an_empty_instant_lane(recording_server):
    lane = instant_lane(recording_server, login(recording_server))
    assert lane["running"] == [] and lane["waiting"] == []


def test_the_executions_show_a_worker_hook_waiting_behind_a_held_lane(recording_server):
    server = recording_server
    cookie = login(server)
    started_worker(server.journal, "s-queue-worker")
    worker = HookSamples.sample("post_tool_use").with_fields(session="s-queue-worker", event_id="queue-worker")
    with ThreadPoolExecutor(1) as pool:
        with server.context.hook_database.used(AGENT_HOOK_PRIORITY, 1):
            first = pool.submit(post_hook, server, worker)
            assert waiting_entries(server, 1)
            lane = instant_lane(server, cookie)
            assert [entry["class"] for entry in lane["waiting"]] == ["agent hook"] and all(entry["reason"] for entry in lane["waiting"]), lane
        first.result()


def test_the_executions_show_a_waiting_viewer_request_while_a_hook_holds_the_lane(recording_server):
    server = recording_server
    cookie = login(server)
    with ThreadPoolExecutor(1) as pool:
        with server.context.hook_database.used(AGENT_HOOK_PRIORITY, 1):
            answer = pool.submit(server.viewer_line_value, cookie, TASK_LIST)
            assert waiting_entries(server, 1)
            lane = instant_lane(server, cookie)
            assert [entry["class"] for entry in lane["running"]] == ["agent hook"] and any(entry["line"] == "task list" for entry in lane["waiting"]), lane
        answer.result()


def test_command_line_can_read_the_executions(recording_server):
    recording_server.expect_cli_exit("queue list --environment main", "/", 0, "short lane:")


def test_a_mixed_batch_answers_both_lines(recording_server):
    server = recording_server
    status, _, body = viewer_answer(server.viewer_port(), "/api/lines", login(server), "", {"lines": [QUEUE_LIST, TASK_LIST]})
    assert status == 200 and [answer["code"] for answer in json.loads(body)["answers"]] == [0, 0], body


@pytest.mark.parametrize("line,window", [(["queue", "list"], "developer.hook-requests"), (["developer", "hook-requests"], "developer.hook-requests"), (["developer", "system-logs"], "developer.system-logs")])
def test_inspection_reads_alone_and_in_a_batch_skip_hooks_and_the_request_log(recording_server, line, window):
    server = recording_server
    cookie = login(server)
    request = {"line": line, "environment": "main", "window": window}
    server.context.hook_database.viewer_tickets.wait_limit_seconds = 5
    with ThreadPoolExecutor(1) as pool:
        with server.context.hook_database.used(MAIN_AGENT_HOOK_PRIORITY, 1):
            pool.submit(server.viewer_line_value, cookie, request).result(timeout=3)
            status, _, body = pool.submit(viewer_answer, server.viewer_port(), "/api/lines", cookie, "", {"lines": [request, request]}).result(timeout=3)
            assert status == 200 and all(answer["code"] == 0 for answer in json.loads(body)["answers"]), body
    assert not server.journal.container.get(HookRequestLog).read()


def test_a_running_cli_line_is_listed_in_the_queue_inspector(recording_server, monkeypatch):
    server = recording_server
    cookie = login(server)
    entered, release = Event(), Event()
    answer = CliEndpoint.answer

    def blocked_answer(endpoint, request, stream):
        entered.set()
        release.wait(5)
        return answer(endpoint, request, stream)

    monkeypatch.setattr(CliEndpoint, "answer", blocked_answer)
    with ThreadPoolExecutor(1) as pool:
        pending = pool.submit(server.expect_cli_exit, "task list", "/", 0, "")
        try:
            assert entered.wait(3)
            assert "task list" in running_lines(server, cookie)
        finally:
            release.set()
        pending.result(timeout=3)


def test_a_running_viewer_get_is_listed_in_the_queue_inspector(recording_server, monkeypatch):
    server = recording_server
    cookie = login(server)
    entered, release = Event(), Event()
    windows = WindowsRoute.windows

    def blocked_answer(route, environment):
        entered.set()
        release.wait(5)
        return windows(route, environment)

    monkeypatch.setattr(WindowsRoute, "windows", blocked_answer)
    with ThreadPoolExecutor(1) as pool:
        pending = pool.submit(viewer_answer, server.viewer_port(), "/api/windows?environment=main", cookie, "")
        try:
            assert entered.wait(3)
            assert "GET /api/windows?environment=main" in running_lines(server, cookie)
        finally:
            release.set()
        assert pending.result(timeout=3)[0] == 200


def test_a_main_agent_hook_is_answered_while_an_agent_hook_holds_the_whole_instant_lane(recording_server):
    body = dict(HookSamples.sample("post_tool_use").with_fields(session=SESSION, environment="main", role="main", event_id="ahead-of-the-lane").body)
    with recording_server.context.hook_database.used(AGENT_HOOK_PRIORITY, 1):
        recording_server.expect_hook_answer("/hook", body, 200, '"refusal":')


def test_a_cli_line_is_not_queued_behind_a_slow_round(recording_server):
    server = recording_server
    work = BlockedRound()
    with ThreadPoolExecutor(1) as pool:
        running = pool.submit(JournalRound(server.journal.home, "plugin listener thread", work, PerRoundContainer(server.journal.home)).run)
        try:
            assert work.entered.wait(ROUND_START_LIMIT_SECONDS)
            server.expect_cli_exit("task list", "/", 0, "")
            assert not work.release.is_set()
        finally:
            work.release.set()
        running.result(timeout=5)


def test_a_tick_round_does_not_wait_behind_a_running_hook(recording_server):
    work = BlockedRound()
    work.release.set()
    with recording_server.context.hook_database.used(MAIN_AGENT_HOOK_PRIORITY, 1):
        JournalRound(recording_server.journal.home, "output reading", work, PerRoundContainer(recording_server.journal.home)).run()
        assert work.entered.is_set()


HEADERS = {"X-Journal-Hook-Id": "firing-1", "X-Journal-Env": "main"}


def logging_story(played, size: int = 3):
    story = played(HookRecordingEnabled)
    story.expect_success(f"setting set {HOOK_REQUEST_LOG_SIZE_SETTING} {size} --project", actor=story.user)
    return story


def expect_day_start_log(log, expected) -> None:
    actual = [row.day_start for row in log.read()]
    assert actual == expected, actual


def expect_time(row, expected) -> None:
    actual = len(row['time'])
    assert actual == expected, actual


def expect_day_start(row) -> None:
    actual = row['day_start']
    assert actual, actual


def expect_number_event_id_body(log, expected) -> None:
    actual = [(row.number, row.body['event_id']) for row in log.read()]
    assert actual == expected, actual


def test_only_the_first_request_of_each_day_has_a_day_line(played):
    story = logging_story(played)
    log = story.container.get(HookRequestLog)
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    story.clock.advance(timedelta(days=1))
    log.record("claude", HEADERS, {"event": "stop"}, 0, HookAnswer.ALLOWED)
    expect_day_start_log(log, [True, True, False])
