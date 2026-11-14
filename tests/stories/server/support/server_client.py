import threading
import sqlite3
from engine.time.polled_wait import PolledWait
from engine.database.reported_findings import ReportedFindings
import json
import shlex
import socket
import time
from unittest.mock import patch
from engine.time.clock import Clock
from contextlib import contextmanager
from pathlib import Path
from threading import Event

from engine.cli.console import ERROR_CODE
from engine.journal.journal_home import JournalHome
from server.endpoints.cli_endpoint import CliEndpoint
from server.endpoints.hook_endpoint import HookEndpoint
from engine.performance.timing import Timing
from engine.performance.timing_log import TimingLog
from engine.testing.stories.story import Story
from tests.integration.support.server_client import ServerClient
from tests.integration.support.server_harness import SYSTEM_CLOCK, TEST_HOOK_LIMIT_SECONDS, TEST_INSTANT_CAPACITY, TEST_STOP_LIMIT_SECONDS, TIMEOUT_SECONDS, ViewerFactory, local_viewer, raw_answer, read_answer, request_answer, running_server
from tests.stories.server.support.story_line_route import StoryLineRoute
from engine.testing.expectations.line_outcome import LineOutcome
from core.modules.skills.models.agent_skill import AgentSkill
from server.handover.code_folders import CodeFolders
from server.door.journal_door import JournalDoor
from server.door.local_journal_door import LocalJournalDoor
from server.context.server_context import IDLE_CONNECTION_SECONDS, ServerContext
from server.work.listeners.listener_thread import ListenerThread
from server.work.listeners.listener_wake_router import ListenerWakeRouter
from server.work.listeners.listener_wake import ListenerWake
from engine.serving.server_files import ServerFiles
from scripts.timing_report import logged_timings, report
from core.modules.skills.support.start_skills import SESSION_START_KEY
from core.modules.voices.support.voices_settings import AVATAR_KEY

POLL_SECONDS = 0.05
STORY_HOOK_LIMIT_SECONDS = TEST_HOOK_LIMIT_SECONDS
STORY_STOP_LIMIT_SECONDS = TEST_STOP_LIMIT_SECONDS
STORY_INSTANT_CAPACITY = TEST_INSTANT_CAPACITY
HOOK_POLL_SECONDS = 0.01


class ServerStory(ServerClient):
    """A story's journal with a server running on it, and the checks of what the server answers."""

    def __init__(self, story: Story, socket_path: Path, context: ServerContext) -> None:
        super().__init__(socket_path, context)
        self.story = story

    # a main agent's hook never waits for a place, so the hook is held by another writer holding the database, for
    # the whole hook or, with locked seconds, until the writer lets go part-way
    def expect_locked_hook_answer(self, body: object, text: str, locked_seconds: float | None = None) -> None:
        if locked_seconds is None:
            with self.story.busy_database():
                self.expect_hook_answer("/hook", body, 200, text)
            return
        writer = sqlite3.connect(self.story.home.database, timeout=0, autocommit=True, check_same_thread=False)
        writer.execute("BEGIN IMMEDIATE")
        release = threading.Timer(locked_seconds, writer.execute, ["ROLLBACK"])
        release.start()
        try:
            self.expect_hook_answer("/hook", body, 200, text)
        finally:
            release.join(TIMEOUT_SECONDS)
            writer.close()

    def post_hook_disconnect(self, body: dict[str, object]) -> None:
        """Holds the hook in the queue until its client has closed, after the server took the connection, as a
        hook that gave up at its limit does, and waits until the server has answered it."""
        data = json.dumps(body).encode()
        finished = Event()
        dropped_answer = HookEndpoint.answer_lost

        def drop_record(endpoint, reply):
            try:
                dropped_answer(endpoint, reply)
            finally:
                finished.set()

        with patch.object(HookEndpoint, "answer_lost", drop_record):
            with self.story.busy_database(), socket.socket(socket.AF_UNIX) as connection:
                connection.connect(str(self.socket_path))
                connection.sendall(f"POST /hook HTTP/1.1\r\nHost: journal\r\nContent-Length: {len(data)}\r\nConnection: close\r\n\r\n".encode() + data)
                executions = self.context.hook_database.executions
                assert PolledWait(TIMEOUT_SECONDS, HOOK_POLL_SECONDS).poll(lambda: any(entry.is_running for entry in executions.read())), "the server never took the hook"
            assert finished.wait(TIMEOUT_SECONDS), f"the server never completed the lost hook {body['firing']}"

    def viewer_line_value(self, cookie: str, body: dict[str, object]) -> dict[str, object]:
        self.story.steps.append(f"viewer line {json.dumps(body, sort_keys=True)}")
        return super().viewer_line_value(cookie, body)

    @contextmanager

    def expect_direct_run_answer(self, line: str, folder: str = "/") -> None:
        direct = self.story.run(line)
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "variables": {}, "folder": folder})
        assert (answer.status, answer.exit_code, answer.text) == (200, direct.code, direct.output_text), (answer, direct)

    def expect_busy_timeout(self, seconds: float) -> None:
        idle_thread = ListenerThread(lambda: None, lambda error: None)
        assert CliEndpoint(self.story.home, ListenerWake(ListenerWakeRouter.waking(idle_thread)), ReportedFindings()).line_run.busy_timeout_seconds == seconds

    def expect_stale_answer_released_files(self, line: str, task_listing: LineOutcome) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/"})
        assert answer.status == 409 and "newer code" in answer.text, answer
        assert self.story.run("task list --environment main").output_text == task_listing.output_text
        files = ServerFiles(self.story.home)
        assert not self.socket_path.exists() and not files.pid_file.exists() and files.acquire_lock(), "the stale server still holds its files"
        files.release_lock()

    def expect_raw_request_error(self, raw_request: bytes, error_name: str) -> None:
        answer = read_answer(raw_answer(self.socket_path, raw_request))
        assert answer.status == 500 and error_name in answer.text and answer.text.count("\n") <= 1, answer
        assert "Traceback" in ServerFiles(self.story.home).log.read_text()

    def expect_deadline_rollback(self, line: str, check_line: str, absent_line: str) -> None:
        answer = request_answer(self.socket_path, "POST", "/cli", {"argv": shlex.split(line), "folder": "/", "deadline_seconds": 0})
        assert answer.exit_code == ERROR_CODE and "deadline passed" in answer.text, answer
        assert absent_line not in self.story.run(check_line).output_text.splitlines(), self.story.run(check_line).output_text

    def expect_eventually(self, line: str, expected_line: str) -> None:
        deadline = time.monotonic() + TIMEOUT_SECONDS
        while time.monotonic() < deadline:
            if expected_line in self.story.run(line).output_text.splitlines():
                return
        raise AssertionError(f"{line} never printed {expected_line!r}: {self.story.run(line).output_text}")

    def expect_line(self, line: str, expected_line: str) -> None:
        assert expected_line in self.story.run(line).output_text.splitlines(), self.story.run(line).output_text

    def expect_answer_with_unwritable_timing_log(self, line: str) -> None:
        TimingLog(self.story.home).path.mkdir(parents=True)
        self.post_timed_line(line, "go_start=1")
        assert "timing line not written" in ServerFiles(self.story.home).log.read_text()


def expect_timing_report_steps(home: JournalHome, route_line: str, steps: list[str]) -> None:
    rows = report(logged_timings(TimingLog(home).path.read_text().splitlines())).splitlines()
    assert rows[0] == f"{route_line}  (1 requests)" and [row.split("  ")[1].strip() for row in rows[2:]] == steps, rows


def expect_timing_lines(home: JournalHome, lines: list[tuple[str, list[str]]]) -> None:
    log_lines = [json.loads(line) for line in TimingLog(home).path.read_text().splitlines()]
    assert [(line["request_id"], [name for name, _ in Timing.parsed(line["timing"]).stamps]) for line in log_lines] == lines, log_lines


def without_start_skills(story: Story) -> None:
    story.run(f"setting make {SESSION_START_KEY} '[]'")
    story.run_listeners()
    for row in tuple(story.story_rows(AgentSkill)):
        story.expect_success(f"agent-skill delete {row.id}")


@contextmanager
def server_story(story: Story, code_folders: CodeFolders | None = None, listener_thread_started: bool = True, viewer_factory: ViewerFactory = local_viewer, journal_door: JournalDoor = LocalJournalDoor(), real_time: bool = False, instant_capacity: int = STORY_INSTANT_CAPACITY, idle_connection_seconds: float = IDLE_CONNECTION_SECONDS):
    without_start_skills(story)
    story.run(f"setting make {AVATAR_KEY} false")
    with started_server(story.home, code_folders, listener_thread_started, viewer_factory, journal_door, SYSTEM_CLOCK if real_time else story.clock, instant_capacity, idle_connection_seconds) as (socket_path, context):
        yield ServerStory(story, socket_path, context)


@contextmanager
def started_server(home: JournalHome, code_folders: CodeFolders | None = None, listener_thread_started: bool = True, viewer_factory: ViewerFactory = local_viewer, journal_door: JournalDoor = LocalJournalDoor(), clock: Clock = SYSTEM_CLOCK, instant_capacity: int = STORY_INSTANT_CAPACITY, idle_connection_seconds: float = IDLE_CONNECTION_SECONDS):
    with running_server(home, code_folders, listener_thread_started, viewer_factory, journal_door, clock, instant_capacity, idle_connection_seconds, story_line_route) as (_, socket_path, context):
        yield socket_path, context


def story_line_route(home: JournalHome, wakes: ListenerWakeRouter, reported: ReportedFindings, context: ServerContext) -> StoryLineRoute:
    return StoryLineRoute(home, wakes, reported, completion_callback=context.request_trace.completed)
