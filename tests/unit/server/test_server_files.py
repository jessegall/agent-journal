import os
import shutil
import tempfile
from pathlib import Path
import socket
import stat
import subprocess
import sys

from core.base.journal_home import JournalHome
from server.server_files import ServerFiles, ServerFilesError, socket_path

TIMEOUT_SECONDS = 10
LOCK_SCRIPT = ("import fcntl, sys; f = open(sys.argv[1], 'a')\n"
               "try:\n    fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB); print('taken')\nexcept BlockingIOError:\n    print('held')")


def subprocess_lock_state(path):
    return subprocess.run([sys.executable, "-c", LOCK_SCRIPT, str(path)], capture_output=True, text=True, timeout=TIMEOUT_SECONDS).stdout.strip()


def test_a_second_process_cannot_take_the_lock_while_the_server_holds_it(tmp_path):
    files = ServerFiles(JournalHome(tmp_path))
    assert files.acquire_lock()
    assert subprocess_lock_state(files.lock) == "held"
    files.release_lock()
    assert subprocess_lock_state(files.lock) == "taken"


def test_a_second_take_in_the_same_journal_is_refused_while_the_first_holds_it(tmp_path):
    first, second = ServerFiles(JournalHome(tmp_path)), ServerFiles(JournalHome(tmp_path))
    assert first.acquire_lock() and not second.acquire_lock()
    first.release_lock()


def test_only_the_lock_holder_removes_a_leftover_socket_and_the_socket_is_owner_only():
    short_folder = Path(tempfile.mkdtemp(dir="/tmp"))
    files = ServerFiles(JournalHome(short_folder))
    files.socket.write_text("left over")
    try:
        files.clear_leftover_socket()
        raised = False
    except ServerFilesError:
        raised = True
    assert raised and files.socket.exists()
    files.acquire_lock()
    files.clear_leftover_socket()
    listener = socket.socket(socket.AF_UNIX)
    listener.bind(str(files.socket))
    files.restrict_socket()
    assert stat.S_IMODE(os.stat(files.socket).st_mode) == 0o600
    listener.close()
    files.release_lock()
    shutil.rmtree(short_folder)


def test_a_stop_removes_the_socket_and_pid_file_only_while_the_pid_file_names_this_server(tmp_path):
    files = ServerFiles(JournalHome(tmp_path))
    files.socket.write_text("")
    files.pid_file.write_text("1")
    files.remove_server_files()
    assert files.socket.exists() and files.pid_file.exists()
    files.write_pid()
    files.remove_server_files()
    assert not files.socket.exists() and not files.pid_file.exists()


def test_a_journal_folder_too_deep_for_a_socket_path_gets_a_short_one_named_for_it(tmp_path):
    deep_home = JournalHome(tmp_path / ("deep-folder-" * 10))
    shallow_home = JournalHome(Path("/tmp/j"))
    assert len(str(socket_path(deep_home))) < 100 and socket_path(deep_home) == socket_path(JournalHome(tmp_path / ("deep-folder-" * 10)))
    assert socket_path(shallow_home) == Path("/tmp/j/server.sock").resolve()
