import os
import stat
import subprocess
from pathlib import Path

import pytest

from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from engine.tunnel.tunnel_state import TunnelState
from tests.stories.tunnels.tunler.support.real_tunler import real_client
from tunnels.tunler.support.tunler_installer import TunlerInstaller
from engine.testing.expectations.expect_row import expect_row
from tests.stories.support.story_checks import expect_absent_exists_with_log, expect_file_2

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


def record(tmp_path: Path) -> list[str]:
    return (tmp_path / "record").read_text().splitlines()


def test_the_status_reads_the_programs_answer_and_a_login_it_no_longer_accepts(home):
    status = real_client(home).status()
    expect_row(status, installed=True, authenticated=False, rejected=True, account="ada", host="tunnels.example")
    expect_endswith_command_status(status, "/bin/tunler")


def test_a_login_hands_the_passwords_through_the_environment_and_never_on_the_command_line(home, tmp_path):
    expect_connected_login_real(home, "tunnels.example", "ada", "right")
    expect_record(tmp_path, ["login ada --host=tunnels.example"])
    expect_record_file(tmp_path, "record.secrets", ["right none"])


def test_a_login_for_an_account_that_does_not_exist_asks_for_the_master_password(home):
    login = real_client(home).login("tunnels.example", "ada", "new", None)
    expect_needs_master_login(login)
    expect_absent_connected_login(login)
    expect_error_login_with(login, "master password")


def test_a_login_refused_with_the_master_password_gives_the_programs_last_line(home):
    login = real_client(home).login("tunnels.example", "ada", "new", "top")
    expect_absent_needs_master_login(login)
    expect_error_login(login, "no such account")


def test_the_domains_are_the_programs_lines_and_a_release_names_the_subdomain(home, tmp_path):
    client = real_client(home)
    expect_domains_client(client, ["one.tunnels.example", "two.tunnels.example"])
    client.release("one.tunnels.example")
    expect_record_2(tmp_path, 1, "release one")
    with pytest.raises(Refusal, match="not yours"):
        client.release("two.tunnels.example")


def test_the_version_and_an_update_read_the_programs_answers(home):
    client = real_client(home)
    version = client.version()
    expect_row(version, current="v0.2.2", latest="v0.3.0", update_available=True)
    expect_update_client(client, "updated to v0.3.0")


def test_a_tunler_started_by_one_client_is_seen_running_by_another_and_logging_out_stops_it(home):
    server = real_client(home)
    server.start(PORT, "cart-team")
    server.log.write_text("tunnel up: cart-team.tunnels.example (https)\n")
    second = real_client(home)
    expect_state_second(second, TunnelState.CONNECTED)
    expect_address_second(second, "cart-team.tunnels.example")
    second.logout()
    server.process.process.wait(timeout=10)
    expect_absent_running_server(server)
    expect_state_second(second, TunnelState.DISCONNECTED)


class LocalInstaller(TunlerInstaller):
    """The installer with its download swapped for a file written here, so a story reaches no server."""

    def __init__(self, target: Path, body: str) -> None:
        self.target, self.body = target, body

    def local_path(self) -> Path:
        return self.target

    def download(self, host: str, part: Path) -> None:
        part.write_text(self.body)


def test_an_install_puts_a_working_tunler_in_place_and_names_its_version(tmp_path):
    target = tmp_path / "local" / "tunler"
    expect_install_local_installer(target, '#!/bin/sh\necho "tunler v9.9.9"\n', "tunnels.example", "tunler v9.9.9 is installed")
    expect_st_mode_stat(target)
    expect_stdout_subprocess_with(target, "version", "v9.9.9")


def test_what_is_no_working_tunler_replaces_nothing(tmp_path):
    target = tmp_path / "local" / "tunler"
    target.parent.mkdir()
    target.write_text("the old one")
    with pytest.raises(Refusal, match="not a working tunler"):
        LocalInstaller(target, "#!/bin/sh\necho nonsense\n").install("tunnels.example")
    expect_file_2(target, "the old one")
    expect_absent_exists_with_log(target, "tunler.part")


def expect_record(tmp_path: Path, expected) -> None:
    actual = record(tmp_path)
    assert actual == expected, actual


def expect_st_mode_stat(target) -> None:
    actual = target.stat().st_mode & stat.S_IXUSR
    assert actual, actual


def expect_stdout_subprocess_with(target, text, expected) -> None:
    actual = subprocess.run([str(target), text], capture_output=True, text=True, check=True).stdout
    assert expected in actual, actual


def expect_install_local_installer(target, text, text_2, expected) -> None:
    actual = LocalInstaller(target, text).install(text_2)
    assert actual == expected, actual


def expect_absent_running_server(server) -> None:
    actual = server.running()
    assert not actual, actual


def expect_state_second(second, expected) -> None:
    actual = second.state()
    assert actual is expected, actual


def expect_address_second(second, expected) -> None:
    actual = second.address()
    assert actual == expected, actual


def expect_update_client(client, expected) -> None:
    actual = client.update()
    assert actual == expected, actual


def expect_record_2(tmp_path, number, expected) -> None:
    actual = record(tmp_path)[-number]
    assert actual == expected, actual


def expect_domains_client(client, expected) -> None:
    actual = client.domains()
    assert actual == expected, actual


def expect_absent_needs_master_login(login) -> None:
    actual = login.needs_master
    assert not actual, actual


def expect_error_login(login, expected) -> None:
    actual = login.error
    assert actual == expected, actual


def expect_needs_master_login(login) -> None:
    actual = login.needs_master
    assert actual, actual


def expect_absent_connected_login(login) -> None:
    actual = login.connected
    assert not actual, actual


def expect_error_login_with(login, expected) -> None:
    actual = login.error
    assert expected in actual, actual


def expect_record_file(tmp_path, text, expected) -> None:
    actual = (tmp_path / text).read_text().splitlines()
    assert actual == expected, actual


def expect_connected_login_real(home, text, text_2, text_3) -> None:
    actual = real_client(home).login(text, text_2, text_3, None).connected
    assert actual, actual


def expect_endswith_command_status(status, text) -> None:
    actual = status.command.endswith(text)
    assert actual, actual
