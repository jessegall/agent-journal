import os
import time

from core.modules.processes.support.run_queue_halt import RunQueueHalt
from engine.hosting.server_restart_state import RESTART_LIMIT_SECONDS
from engine.serving.server_files import ServerFiles

DEAD_PID = 999999


def test_the_session_route_answers_no_cookie_with_401(person_server):
    server, _, _ = person_server
    server.expect_viewer_status("/api/session", 401)


def test_the_server_state_route_answers_without_a_cookie_that_nothing_is_marked(person_server):
    server, _, _ = person_server
    server.expect_viewer_status("/api/server-state", 200, text='"restarting": false')


def test_a_restart_file_and_a_running_installers_file_hold_the_cover(person_server):
    server, _, _ = person_server
    files = ServerFiles(server.home)
    files.mark_restart()
    files.mark_maintenance()
    server.expect_viewer_status("/api/server-state", 200, text='"restarting": true')
    server.expect_viewer_status("/api/server-state", 200, text='"updating": true')


def test_a_dead_installers_file_and_an_old_restart_file_end_the_cover(person_server):
    server, _, _ = person_server
    files = ServerFiles(server.home)
    files.maintenance.write_text(str(DEAD_PID))
    files.mark_restart()
    old = time.time() - RESTART_LIMIT_SECONDS - 1
    os.utime(files.restart_mark, (old, old))
    server.expect_viewer_status("/api/server-state", 200, text='"restarting": false')
    server.expect_viewer_status("/api/server-state", 200, text='"updating": false')
    assert not RunQueueHalt(server.home).is_halted
