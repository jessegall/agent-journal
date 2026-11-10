from tests.stories.server.support.server_fixtures import person_server

import pytest

import os

from core.base.server_restart_state import RESTART_LIMIT_SECONDS
from engine.version.journal_version import JOURNAL_VERSION
from core.modules.processes.support.run_queue_halt import RunQueueHalt
from core.base.serving.server_files import ServerFiles
from tests.stories.core.support.fixtures import UserJoined
from tests.stories.server.support.server_client import server_story

DEAD_PID = 999999


def test_the_session_route_answers_a_person_cookie_with_its_kind_and_person(person_server):
    story = person_server
    cookie = story.expect_viewer_login(story.viewer_key("Ada"))
    story.expect_viewer_status("/api/session", 200, cookie, text='"type": "person"')
    story.expect_viewer_status("/api/session", 200, cookie, text=f'"journal_version": "{JOURNAL_VERSION}"')


def test_the_session_route_answers_no_cookie_with_401(person_server):
    story = person_server
    story.expect_viewer_status("/api/session", 401)


def test_the_server_state_route_answers_without_a_cookie_that_nothing_is_marked(person_server):
    story = person_server
    story.expect_viewer_status("/api/server-state", 200, text='"restarting": false')


def test_a_restart_file_and_a_running_installers_file_hold_the_cover(person_server):
    story = person_server
    files = ServerFiles(story.story.home)
    files.mark_restart()
    files.mark_maintenance()
    story.expect_viewer_status("/api/server-state", 200, text='"restarting": true')
    story.expect_viewer_status("/api/server-state", 200, text='"updating": true')


def test_a_dead_installers_file_and_an_old_restart_file_end_the_cover(person_server):
    story = person_server
    files = ServerFiles(story.story.home)
    files.maintenance.write_text(str(DEAD_PID))
    files.mark_restart()
    old = story.story.clock.epoch_seconds() - RESTART_LIMIT_SECONDS - 1
    os.utime(files.restart_mark, (old, old))
    story.expect_viewer_status("/api/server-state", 200, text='"restarting": false')
    story.expect_viewer_status("/api/server-state", 200, text='"updating": false')
    expect_absent_halted_queue_halt(story)


def expect_absent_halted_queue_halt(story) -> None:
    actual = RunQueueHalt(story.story.home).is_halted
    assert not actual, actual
