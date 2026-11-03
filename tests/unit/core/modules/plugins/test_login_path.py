import stat

from core.base.journal_home import JournalHome
from core.modules.plugins.support.login_path import FALLBACK_FOLDERS, LoginPath


def shell_printing(tmp_path, monkeypatch, output: str) -> None:
    shell = tmp_path / "shell"
    shell.write_text(f"#!/bin/sh\nprintf '%s' '{output}'\n")
    shell.chmod(shell.stat().st_mode | stat.S_IEXEC)
    monkeypatch.setenv("SHELL", str(shell))


def test_the_login_shells_path_is_read_past_what_its_startup_prints(tmp_path, monkeypatch):
    shell_printing(tmp_path, monkeypatch, "welcome\njournal-path-begin:/home/.nvm/bin:/usr/bin:journal-path-finish")
    assert LoginPath.shell_path() == "/home/.nvm/bin:/usr/bin"


def test_a_shell_that_gives_no_path_answers_nothing(tmp_path, monkeypatch):
    shell_printing(tmp_path, monkeypatch, "welcome")
    assert LoginPath.shell_path() == ""


def test_with_no_shell_the_usual_folders_are_used(monkeypatch, tmp_path):
    monkeypatch.setenv("SHELL", str(tmp_path / "missing"))
    login_path = LoginPath(JournalHome(tmp_path))
    login_path.read_shell()
    assert login_path.value() == ":".join(FALLBACK_FOLDERS)
