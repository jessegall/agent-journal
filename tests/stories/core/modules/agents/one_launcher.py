import json
import os
from datetime import datetime, timezone

import pytest

from engine.caller.process_row import ProcessRow
from engine.caller.process_table import ProcessTable
from engine.journal.journal_home import LAUNCHER_SOCKET
from engine.process.leftover_process import LeftoverProcess
from engine.time.timestamp import Timestamp
from core.modules.agents.models.agent import Agent
from core.modules.agents.support.launcher_service import LauncherService
from core.modules.agents.testing.fake_launcher import FakeLauncher
from tests.stories.core.modules.helpers.helper_jobs import EndedHelper, JOB, helper_agent, resumable_session
from tests.stories.core.support.agent_labels import agent_number
from tests.stories.core.support.coding_fixtures import UserBuilder

FIRST_LAUNCHER_PID, SECOND_LAUNCHER_PID = 7001, 7002
STARTED_AT = Timestamp(datetime(2026, 10, 31, 9, 0, tzinfo=timezone.utc))
MESSAGES = "message list --json --limit 20 --environment main"


@pytest.fixture
def slow_launcher(new_story):
    """An ended helper, and a launcher that is alive but answers no connection: its socket file is there, a
    connect to it is refused, and the link beside the socket names a process that runs."""
    story = new_story(fixture=EndedHelper)
    socket_path = story.home.socket(LAUNCHER_SOCKET)
    FakeLauncher.listening(socket_path).server.close()
    owner_link = socket_path.with_name(socket_path.name + ".pid")
    owner_link.unlink(missing_ok=True)
    owner_link.symlink_to(str(os.getpid()))
    yield story
    owner_link.unlink(missing_ok=True)


def test_548_a_launcher_whose_process_runs_and_is_slow_to_answer_is_not_replaced_by_a_second_launcher(slow_launcher, monkeypatch):
    story = slow_launcher
    started_launchers: list[str] = []
    monkeypatch.setattr(LauncherService, "start", lambda service: started_launchers.append("launcher") or False)
    resumable_session(story, helper_agent(story), monkeypatch)
    story.expect_success(f'helper send {agent_number(story, helper_agent(story).id)} "{JOB}"', actor=story.agent)
    story.run_listeners()
    story.expect_rows(started_launchers == [], story.home.socket(LAUNCHER_SOCKET).exists(), detail=f"launchers started: {started_launchers}, the socket file is there: {story.home.socket(LAUNCHER_SOCKET).exists()}")


def test_558_two_launchers_that_run_are_named_once_to_the_person_with_their_process_numbers_and_one_is_stopped(new_story, monkeypatch):
    story = new_story(fixture=UserBuilder)
    stopped_pids: list[int] = []
    launcher_line = f"{story.home.folder / 'bin' / 'journal'} launcher-service"
    monkeypatch.setattr(ProcessTable, "rows", lambda table: [ProcessRow(FIRST_LAUNCHER_PID, 1, STARTED_AT), ProcessRow(SECOND_LAUNCHER_PID, FIRST_LAUNCHER_PID, STARTED_AT)])
    monkeypatch.setattr(LeftoverProcess, "command_line", staticmethod(lambda pid: launcher_line if pid in (FIRST_LAUNCHER_PID, SECOND_LAUNCHER_PID) else ""))
    monkeypatch.setattr(LeftoverProcess, "stop", lambda pid, program: stopped_pids.append(pid) or True)
    main_session = story.row(Agent, story.agent.id).session
    story.tick(main_session)
    story.tick(main_session)
    story.run_listeners()
    rows = json.loads(story.run(MESSAGES, actor=story.user).output_text)["rows"]
    naming = [row["text"] for row in rows if str(FIRST_LAUNCHER_PID) in row["text"] and str(SECOND_LAUNCHER_PID) in row["text"]]
    story.expect_rows(len(naming) == 1, len(stopped_pids) == 1, detail=f"messages naming both launchers: {naming}, stopped: {stopped_pids}")
