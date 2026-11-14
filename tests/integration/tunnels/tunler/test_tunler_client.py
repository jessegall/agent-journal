import os
import signal
import stat
import subprocess
from pathlib import Path

import pytest

from engine.enums.tunnel_state import TunnelState
from engine.errors.refusal import Refusal
from engine.journal.journal_home import JournalHome
from tunnels.tunler.support.tunler_client import TunlerClient
from tunnels.tunler.support.tunler_installer import TunlerInstaller

SCRIPT = """#!/bin/sh
echo "$@" >> "$TUNLER_RECORD"
echo "${TUNLER_PASSWORD:-none} ${TUNLER_MASTER_PASSWORD:-none}" >> "$TUNLER_RECORD.secrets"
case "$1" in
status) echo '{"host":"tunnels.example","user":"ada","logged_in":true,"auth_ok":false}' ;;
login) [ "$TUNLER_PASSWORD" = "right" ] && exit 0; [ -n "$TUNLER_MASTER_PASSWORD" ] && { echo "no such account" >&2; exit 1; }; echo "this account does not exist: give the master password" >&2; exit 1 ;;
logout) exit 0 ;;
domains) printf 'one.tunnels.example\\n\\ntwo.tunnels.example\\n' ;;
release) [ "$2" = "one" ] && exit 0; echo "not yours" >&2; exit 1 ;;
version) echo "tunler v0.2.2" ;;
update) [ "$2" = "--check" ] && echo '{"current":"v0.2.2","latest":"v0.3.0","update_available":true}' || printf 'downloading\\nupdated to v0.3.0\\n' ;;
*) sleep 300 ;;
esac
"""
PORT = 8000
SUBDOMAIN = "cart-team"
STOP_LIMIT_SECONDS = 5
SLEEPING_SCRIPT = "#!/bin/sh\nsleep 300 &\ntrap 'kill $!; exit 0' TERM\nwait\n"


# a stand-in tunler program on the path that records its arguments and the passwords it was handed
@pytest.fixture
def home(tmp_path, monkeypatch) -> JournalHome:
    folder = tmp_path / "bin"
    folder.mkdir()
    program = folder / "tunler"
    program.write_text(SCRIPT)
    program.chmod(0o755)
    monkeypatch.setenv("PATH", f"{folder}:{os.environ['PATH']}")
    monkeypatch.setenv("TUNLER_RECORD", str(tmp_path / "record"))
    journal = JournalHome(tmp_path / "project" / ".journal")
    journal.folder.mkdir(parents=True)
    return journal


def record(tmp_path: Path, name: str = "record") -> list[str]:
    return (tmp_path / name).read_text().splitlines()


class LocalInstaller(TunlerInstaller):
    """The installer with its download swapped for a file written here, so a test reaches no server."""

    def __init__(self, target: Path, body: str) -> None:
        self.target, self.body = target, body

    def local_path(self) -> Path:
        return self.target

    def download(self, host: str, part: Path) -> None:
        part.write_text(self.body)


def test_the_status_reads_the_programs_answer_and_a_login_it_no_longer_accepts(home):
    status = TunlerClient(home).status()
    assert (status.installed, status.authenticated, status.rejected, status.account, status.host) == (True, False, True, "ada", "tunnels.example"), status
    assert status.command.endswith("/bin/tunler"), status


def test_a_login_hands_the_passwords_through_the_environment_and_never_on_the_command_line(home, tmp_path):
    assert TunlerClient(home).login("tunnels.example", "ada", "right", None).connected
    assert record(tmp_path) == ["login ada --host=tunnels.example"]
    assert record(tmp_path, "record.secrets") == ["right none"]


def test_a_login_for_an_account_that_does_not_exist_asks_for_the_master_password(home):
    login = TunlerClient(home).login("tunnels.example", "ada", "new", None)
    assert login.needs_master and not login.connected and "master password" in login.error, login


def test_a_login_refused_with_the_master_password_gives_the_programs_last_line(home):
    login = TunlerClient(home).login("tunnels.example", "ada", "new", "top")
    assert not login.needs_master and login.error == "no such account", login


def test_the_domains_are_the_programs_lines_and_a_release_names_the_subdomain(home, tmp_path):
    client = TunlerClient(home)
    assert client.domains() == ["one.tunnels.example", "two.tunnels.example"]
    client.release("one.tunnels.example")
    assert record(tmp_path)[-1] == "release one"
    with pytest.raises(Refusal, match="not yours"):
        client.release("two.tunnels.example")


def test_the_version_and_an_update_read_the_programs_answers(home):
    client = TunlerClient(home)
    version = client.version()
    assert (version.current, version.latest, version.update_available) == ("v0.2.2", "v0.3.0", True), version
    assert client.update() == "updated to v0.3.0"


def test_a_tunler_started_by_one_client_is_seen_running_by_another_and_logging_out_stops_it(home):
    server = TunlerClient(home)
    server.start(PORT, "cart-team")
    server.log.write_text("tunnel up: cart-team.tunnels.example (https)\n")
    second = TunlerClient(home)
    assert second.state() is TunnelState.CONNECTED
    assert second.address() == "cart-team.tunnels.example"
    second.logout()
    server.process.process.wait(timeout=10)
    assert not server.running()
    assert second.state() is TunnelState.DISCONNECTED


def test_an_install_puts_a_working_tunler_in_place_and_names_its_version(tmp_path):
    target = tmp_path / "local" / "tunler"
    assert LocalInstaller(target, '#!/bin/sh\necho "tunler v9.9.9"\n').install("tunnels.example") == "tunler v9.9.9 is installed"
    assert target.stat().st_mode & stat.S_IXUSR
    assert "v9.9.9" in subprocess.run([str(target), "version"], capture_output=True, text=True, check=True).stdout


def test_what_is_no_working_tunler_replaces_nothing(tmp_path):
    target = tmp_path / "local" / "tunler"
    target.parent.mkdir()
    target.write_text("the old one")
    with pytest.raises(Refusal, match="not a working tunler"):
        LocalInstaller(target, "#!/bin/sh\necho nonsense\n").install("tunnels.example")
    assert target.read_text() == "the old one"
    assert not target.with_name("tunler.part").exists()


def running_tunlers(program: Path) -> list[int]:
    listing = subprocess.run(["ps", "-axo", "pid=,command="], capture_output=True, text=True, check=True).stdout.splitlines()
    return [int(line.split()[0]) for line in listing if str(program) in line and "ps -axo" not in line]


# a stand-in tunler that only sleeps until it is stopped, killed at the end with every copy of it still running
@pytest.fixture
def sleeping_program(tmp_path, monkeypatch):
    folder = tmp_path / "bin"
    folder.mkdir()
    tunler = folder / "tunler"
    tunler.write_text(SLEEPING_SCRIPT)
    tunler.chmod(0o755)
    monkeypatch.setenv("PATH", f"{folder}:{os.environ['PATH']}")
    yield tunler
    for pid in running_tunlers(tunler):
        os.kill(pid, signal.SIGKILL)


def empty_home(tmp_path) -> JournalHome:
    home = JournalHome(tmp_path / "project" / ".journal")
    home.folder.mkdir(parents=True)
    return home


def test_a_server_killed_with_its_tunler_up_finds_one_tunler_after_it_starts_again(sleeping_program, tmp_path):
    home = empty_home(tmp_path)
    first = TunlerClient(home)
    first.start(PORT, SUBDOMAIN)
    leftover = first.process.pid
    assert running_tunlers(sleeping_program) == [leftover]
    second = TunlerClient(home)
    second.start(PORT, SUBDOMAIN)
    first.process.wait(STOP_LIMIT_SECONDS)
    assert running_tunlers(sleeping_program) == [second.process.pid] and leftover != second.process.pid
    second.stop()
    assert running_tunlers(sleeping_program) == []
    assert not (home.folder / "tunnel.pid").exists()


def test_a_pid_that_names_some_other_program_is_left_alone(sleeping_program, tmp_path):
    home = empty_home(tmp_path)
    unrelated_process = subprocess.Popen(["sleep", "300"])
    try:
        (home.folder / "tunnel.pid").write_text(str(unrelated_process.pid))
        client = TunlerClient(home)
        client.start(PORT, SUBDOMAIN)
        assert unrelated_process.poll() is None
        client.stop()
    finally:
        unrelated_process.kill()
        unrelated_process.wait()
