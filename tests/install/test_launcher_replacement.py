import subprocess
from unittest.mock import Mock

import pytest

from engine.journal.journal_home import JournalHome
from engine.errors.refusal import Refusal
from core.base.serving.code_handover import CodeHandover
from core.base.serving.launcher_replacement import LauncherReplacement


@pytest.fixture
def launcher_home(tmp_path):
    home = JournalHome(tmp_path / ".journal")
    binary = home.folder / "bin" / "journal"
    binary.parent.mkdir(parents=True)
    binary.touch()
    socket = home.socket("launcher")
    socket.parent.mkdir(parents=True, exist_ok=True)
    socket.touch()
    yield home
    socket.unlink(missing_ok=True)


def test_an_install_asks_the_new_executable_to_replace_the_existing_launcher(launcher_home, monkeypatch):
    run = Mock(return_value=subprocess.CompletedProcess([], 0, "", ""))
    monkeypatch.setattr(subprocess, "run", run)
    LauncherReplacement(launcher_home).run()
    arguments, options = run.call_args
    assert arguments[0] == [str(launcher_home.folder / "bin" / "journal"), "launcher-replace"]
    assert options["env"]["JOURNAL_HOME"] == str(launcher_home.folder)
    assert options["timeout"] == 12


def test_an_install_with_no_launcher_starts_none(launcher_home, monkeypatch):
    launcher_home.socket("launcher").unlink()
    run = Mock()
    monkeypatch.setattr(subprocess, "run", run)
    LauncherReplacement(launcher_home).run()
    run.assert_not_called()


def test_a_failed_launcher_replacement_is_reported(launcher_home, monkeypatch):
    monkeypatch.setattr(subprocess, "run", Mock(return_value=subprocess.CompletedProcess([], 3, "", "could not listen")))
    with pytest.raises(Refusal, match="the launcher update failed"):
        LauncherReplacement(launcher_home).run()


def test_a_timed_out_replacement_keeps_its_cause(launcher_home, monkeypatch):
    failure = subprocess.TimeoutExpired("journal", 12)
    monkeypatch.setattr(subprocess, "run", Mock(side_effect=failure))
    with pytest.raises(Refusal, match="the launcher update did not finish") as refusal:
        LauncherReplacement(launcher_home).run()
    assert refusal.value.__cause__ is failure


def test_code_handover_updates_the_launcher_after_switching_the_code(tmp_path, monkeypatch):
    handover = CodeHandover(JournalHome(tmp_path / ".journal"))
    changes = []
    monkeypatch.setattr(handover.versions, "switch", lambda tag: changes.append(tag))
    monkeypatch.setattr(LauncherReplacement, "run", lambda self: changes.append("launcher"))
    handover.request_takeover("new code", "")
    assert changes == ["new code", "launcher"]


def test_a_refused_server_handover_keeps_the_launcher(tmp_path, monkeypatch):
    handover = CodeHandover(JournalHome(tmp_path / ".journal"))
    replace = Mock()
    monkeypatch.setattr(handover, "takeover_status", lambda tag: 503)
    monkeypatch.setattr(LauncherReplacement, "run", replace)
    with pytest.raises(Refusal, match="was not taken over"):
        handover.request_takeover("new code", "123")
    replace.assert_not_called()
