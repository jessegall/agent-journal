from concurrent.futures import ThreadPoolExecutor
from threading import Event
from time import perf_counter

from core.testing.hook_samples import HookSamples
from server.endpoints.cli_endpoint import CliEndpoint
from server.endpoints.hook_endpoint import HookEndpoint
from server.hook.queue_priority import QueuePriority
from server.hook.queue_request import QueueRequest
from server.journal_round import JournalRound
from server.round_work import RoundWork
from server.viewer.windows_route import WindowsRoute
from tests.stories.server.developer_hook_requests import recording_server
from tests.stories.server.support.server_client import viewer_answer


CLI_QUEUED_LIMIT_SECONDS = 0.05
LONG_WAIT_LIMIT_SECONDS = 30
ROUND_START_LIMIT_SECONDS = 10


class BlockedRound(RoundWork):
    """Stands in for a slow plugin script or program stop: its round runs until the story releases it."""

    def __init__(self) -> None:
        self.entered, self.release = Event(), Event()

    def run(self, container) -> None:
        self.entered.set()
        self.release.wait(10)


def inspection(server, cookie):
    return server.viewer_line_value(cookie, {"line": ["developer", "request-queue"], "environment": "main", "window": "developer.hook-requests"})


def test_a_running_cli_line_is_listed_in_the_queue_inspector(recording_server, monkeypatch):
    server = recording_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    entered, release = Event(), Event()
    answer = CliEndpoint.answer

    def blocked_answer(endpoint, request, stream):
        entered.set()
        server.story.expect_rows(release.wait(5))
        return answer(endpoint, request, stream)

    monkeypatch.setattr(CliEndpoint, "answer", blocked_answer)
    with ThreadPoolExecutor(1) as pool:
        pending = pool.submit(server.expect_cli_exit, "task list", "/", 0, "")
        try:
            server.story.expect_rows(entered.wait(3))
            server.story.expect_rows(any(row["sender"] == "CLI" and row["event"] == "task list" for row in inspection(server, cookie)["running"]))
        finally:
            release.set()
        pending.result(timeout=3)


def test_a_running_viewer_get_is_listed_in_the_queue_inspector(recording_server, monkeypatch):
    server = recording_server
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    entered, release = Event(), Event()
    windows = WindowsRoute.windows

    def blocked_answer(route, environment):
        entered.set()
        server.story.expect_rows(release.wait(5))
        return windows(route, environment)

    monkeypatch.setattr(WindowsRoute, "windows", blocked_answer)
    with ThreadPoolExecutor(1) as pool:
        pending = pool.submit(viewer_answer, server.viewer_port(), "/api/windows?environment=main", cookie, "")
        try:
            server.story.expect_rows(entered.wait(3))
            server.story.expect_rows(any(row["sender"] == "Viewer" and row["event"] == "GET /api/windows?environment=main" for row in inspection(server, cookie)["running"]))
        finally:
            release.set()
        server.story.expect_rows(pending.result(timeout=3)[0] == 200)


def test_a_main_agent_hook_goes_ahead_of_a_waiting_cli_line(recording_server, monkeypatch):
    server = recording_server
    queue = server.context.hook_database.queue
    order = []
    cli_answer, hook_answer = CliEndpoint.answer, HookEndpoint.prepared_answer

    def cli(endpoint, request, stream):
        order.append("cli")
        return cli_answer(endpoint, request, stream)

    def hook(endpoint, *args):
        order.append("hook")
        return hook_answer(endpoint, *args)

    monkeypatch.setattr(CliEndpoint, "answer", cli)
    monkeypatch.setattr(HookEndpoint, "prepared_answer", hook)
    body = dict(HookSamples.sample("post_tool_use").with_fields(session="s-1", environment="main", role="main", firing="ahead-of-cli").body)
    with ThreadPoolExecutor(2) as pool:
        with server.context.hook_database.used(QueuePriority.AGENT_HOOK, 1):
            command = pool.submit(server.expect_cli_exit, "task list", "/", 0, "")
            with queue.changed:
                server.story.expect_rows(queue.changed.wait_for(lambda: bool(queue.waiting_cli), timeout=2))
            answer = pool.submit(server.expect_hook_answer, "/hook", body, 200, '"refusal":')
            with queue.changed:
                server.story.expect_rows(queue.changed.wait_for(lambda: bool(queue.waiting_hooks), timeout=0.4))
        answer.result(timeout=3)
        command.result(timeout=3)
    server.story.expect_rows(order == ["hook", "cli"])


def test_a_cli_line_runs_after_its_wait_limit_even_while_a_hook_is_held(recording_server):
    server = recording_server
    server.context.hook_database.queue.cli_wait_limit_seconds = 0.05
    with ThreadPoolExecutor(1) as pool:
        with server.context.hook_database.used(QueuePriority.MAIN_AGENT_HOOK, 1):
            started_at = perf_counter()
            command = pool.submit(server.expect_cli_exit, "task list", "/", 0, "")
            command.result(timeout=2)
            server.story.expect_rows(perf_counter() - started_at < 1)


def test_a_slow_round_is_listed_in_the_inspector_and_a_cli_line_is_not_queued_behind_it(recording_server):
    server = recording_server
    queue = server.context.hook_database.queue
    cookie = server.expect_viewer_login(server.viewer_key("Ada"))
    work = BlockedRound()
    with ThreadPoolExecutor(1) as pool:
        running = pool.submit(JournalRound(server.story.home, "plugin listener thread", work, queue=queue).run)
        try:
            server.story.expect_rows(work.entered.wait(ROUND_START_LIMIT_SECONDS))
            started_at = perf_counter()
            with queue.cli_turn(QueueRequest.started("CLI", "task list")):
                queued_seconds = perf_counter() - started_at
            server.story.expect_rows(queued_seconds < CLI_QUEUED_LIMIT_SECONDS)
            server.story.expect_rows(any(row["sender"] == "Background" and row["event"] == "plugin listener thread" for row in inspection(server, cookie)["running"]))
        finally:
            work.release.set()
        running.result(timeout=5)


def test_a_tick_round_does_not_wait_behind_a_running_hook(recording_server):
    server = recording_server
    queue = server.context.hook_database.queue
    queue.cli_wait_limit_seconds = LONG_WAIT_LIMIT_SECONDS
    work = BlockedRound()
    work.release.set()
    with server.context.hook_database.used(QueuePriority.MAIN_AGENT_HOOK, 1):
        started_at = perf_counter()
        JournalRound(server.story.home, "output reading", work, queue=queue).run()
        server.story.expect_rows(work.entered.is_set(), perf_counter() - started_at < ROUND_START_LIMIT_SECONDS)
