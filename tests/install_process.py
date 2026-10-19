# Runs install.sh as a real process over a version 3 journal, so it is not in the default run: python3 -m pytest tests/install_process.py
import subprocess
from pathlib import Path

INSTALL = Path(__file__).resolve().parent.parent / "install.sh"


def installed_over_version_3(tmp_path: Path, setup_code: int, yes: str = "1") -> subprocess.CompletedProcess:
    """A version 3 journal, and a stand-in python that passes the version check and ends setup with the given code, so no journal starts."""
    (tmp_path / ".journal" / "src").mkdir(parents=True)
    (tmp_path / ".journal" / "src" / "VERSION").write_text("3.3.5\n")
    (tmp_path / ".journal" / "project").mkdir()
    (tmp_path / ".journal" / "project" / "message-1.json").write_text("{}")
    bin_ = tmp_path / "bin"
    bin_.mkdir()
    (bin_ / "python3").write_text(f'#!/bin/sh\n[ "$1" = -c ] && exit 0\nexit {setup_code}\n')
    (bin_ / "python3").chmod(0o755)
    return subprocess.run(["sh", str(INSTALL)], cwd=tmp_path, env={"PATH": f"{bin_}:/usr/bin:/bin", "HOME": str(tmp_path), "AGENT_JOURNAL_YES": yes}, capture_output=True, text=True, timeout=120)


def test_installing_over_a_version_3_journal_keeps_it_whole_in_version_3(tmp_path: Path):
    run = installed_over_version_3(tmp_path, 0)
    assert run.returncode == 0, run.stderr
    assert (tmp_path / ".journal" / "version-3" / "project" / "message-1.json").is_file(), "the version 3 journal is kept whole"
    assert (tmp_path / ".journal" / "src" / "journal").is_dir() and not (tmp_path / ".journal" / "src" / "VERSION").exists(), "version 4 is installed beside it"


def test_a_failed_install_puts_the_version_3_journal_back(tmp_path: Path):
    run = installed_over_version_3(tmp_path, 1)
    assert run.returncode != 0 and "back where it was" in run.stderr, run.stderr
    assert (tmp_path / ".journal" / "src" / "VERSION").read_text() == "3.3.5\n" and (tmp_path / ".journal" / "project" / "message-1.json").is_file()
    assert not (tmp_path / ".journal" / "version-3").exists() and not (tmp_path / ".journal-version-3").exists()


def test_without_a_yes_the_installer_changes_nothing(tmp_path: Path):
    run = installed_over_version_3(tmp_path, 0, yes="")
    assert run.returncode == 0 and "Nothing changed" in run.stdout, run.stdout
    assert (tmp_path / ".journal" / "src" / "VERSION").read_text() == "3.3.5\n" and not (tmp_path / ".journal" / "version-3").exists()
