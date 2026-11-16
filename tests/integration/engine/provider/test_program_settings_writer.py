import hashlib
import json
import os
import stat
import tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from unittest.mock import patch

import pytest

from engine.journal.journal_home import JournalHome
from engine.provider.program_settings import ProgramSettings
from engine.provider.settings_file import SettingsFile
from engine.provider.program_settings_writer import ProgramSettingsWriter

SETTINGS_TEXT = '{\n  "permissions": {"defaultMode": "bypassPermissions"}\n}\n'


def sample_settings(home: JournalHome, text: str = SETTINGS_TEXT, links: dict[Path, Path] | None = None) -> ProgramSettings:
    return ProgramSettings("claude", (SettingsFile(home.program_settings_file("claude"), text),), links or {})


def mode_of(path: Path) -> int:
    return stat.S_IMODE(path.stat().st_mode)


def temporaries_in(folder: Path) -> list[Path]:
    return list(folder.glob(f"{tempfile.gettempprefix()}*"))


def test_writes_the_whole_file_read_only(tmp_path: Path):
    home = JournalHome(tmp_path)
    settings_file = home.program_settings_file("claude")
    assert ProgramSettingsWriter(home).write(sample_settings(home)) == (settings_file,)
    assert settings_file.read_bytes() == SETTINGS_TEXT.encode()
    assert mode_of(settings_file) == 0o444
    assert mode_of(home.program_folder("claude")) == 0o700
    assert mode_of(home.programs_folder) == 0o700


def test_rewrites_over_a_read_only_file(tmp_path: Path):
    home = JournalHome(tmp_path)
    writer = ProgramSettingsWriter(home)
    writer.write(sample_settings(home, "{}\n"))
    assert writer.write(sample_settings(home)) == (home.program_settings_file("claude"),)
    assert home.program_settings_file("claude").read_bytes() == SETTINGS_TEXT.encode()
    assert mode_of(home.program_settings_file("claude")) == 0o444


def test_an_unchanged_text_leaves_the_file_as_it_is(tmp_path: Path):
    home = JournalHome(tmp_path)
    writer = ProgramSettingsWriter(home)
    writer.write(sample_settings(home))
    modified_nanoseconds = home.program_settings_file("claude").stat().st_mtime_ns
    assert writer.write(sample_settings(home)) == ()
    assert home.program_settings_file("claude").stat().st_mtime_ns == modified_nanoseconds


def test_a_changed_mode_is_set_again(tmp_path: Path):
    home = JournalHome(tmp_path)
    writer = ProgramSettingsWriter(home)
    writer.write(sample_settings(home))
    os.chmod(home.program_settings_file("claude"), 0o644)
    assert writer.write(sample_settings(home)) == (home.program_settings_file("claude"),)
    assert mode_of(home.program_settings_file("claude")) == 0o444


def test_a_failed_rename_keeps_the_old_file(tmp_path: Path):
    home = JournalHome(tmp_path)
    writer = ProgramSettingsWriter(home)
    writer.write(sample_settings(home, "{}\n"))
    with patch("engine.file.file_access.FileAccess.replace", side_effect=OSError("rename failed")):
        with pytest.raises(OSError, match="rename failed"):
            writer.write(sample_settings(home))
    assert home.program_settings_file("claude").read_bytes() == b"{}\n"
    assert temporaries_in(home.program_folder("claude")) == []


def test_a_stale_temporary_file_is_removed(tmp_path: Path):
    home = JournalHome(tmp_path)
    home.program_folder("claude").mkdir(parents=True)
    stale = home.program_folder("claude") / f"{tempfile.gettempprefix()}abc123"
    stale.write_text("half a file")
    ProgramSettingsWriter(home).write(sample_settings(home))
    assert not stale.exists()
    assert temporaries_in(home.program_folder("claude")) == []


def test_two_writers_take_the_lock_in_turn(tmp_path: Path):
    home = JournalHome(tmp_path)
    texts = [f'{{"writer": {number}, "padding": "{"x" * 4096}"}}\n' for number in range(2)] * 8
    with ThreadPoolExecutor(max_workers=2) as writers:
        list(writers.map(lambda text: ProgramSettingsWriter(home).write(sample_settings(home, text)), texts))
    assert home.program_settings_file("claude").read_text() in texts
    assert temporaries_in(home.program_folder("claude")) == []


def test_a_missing_or_wrong_link_is_made_again(tmp_path: Path):
    home = JournalHome(tmp_path)
    folder = home.program_folder("codex")
    person_folder = tmp_path / "person"
    links = {folder / "auth.json": person_folder / "auth.json", folder / "sessions": person_folder / "sessions"}
    settings = ProgramSettings("codex", (SettingsFile(folder / "config.toml", "approval_policy = \"never\"\n"),), links)
    writer = ProgramSettingsWriter(home)
    assert set(writer.write(settings)) == {folder / "config.toml", *links}
    assert all(Path(os.readlink(link)) == target for link, target in links.items())
    (folder / "auth.json").unlink()
    (folder / "auth.json").write_text("{}")
    (folder / "sessions").unlink()
    (folder / "sessions").symlink_to(tmp_path / "elsewhere")
    assert set(writer.write(settings)) == set(links)
    assert all((link.is_symlink() and Path(os.readlink(link)) == target) for link, target in links.items())
    assert writer.write(settings) == ()


def test_differences_names_changed_bytes_mode_missing_file_and_wrong_link(tmp_path: Path):
    home = JournalHome(tmp_path)
    folder = home.program_folder("codex")
    files = tuple(SettingsFile(folder / name, f"{name}\n") for name in ("bytes.toml", "mode.toml", "missing.toml", "unchanged.toml"))
    links = {folder / "auth.json": tmp_path / "person" / "auth.json", folder / "history.jsonl": tmp_path / "person" / "history.jsonl"}
    settings = ProgramSettings("codex", files, links)
    writer = ProgramSettingsWriter(home)
    writer.write(settings)
    assert writer.differences(settings) == ()
    os.chmod(folder / "bytes.toml", 0o644)
    (folder / "bytes.toml").write_text("changed\n")
    os.chmod(folder / "bytes.toml", 0o444)
    os.chmod(folder / "mode.toml", 0o644)
    (folder / "missing.toml").unlink()
    (folder / "auth.json").unlink()
    (folder / "auth.json").symlink_to(tmp_path / "elsewhere")
    assert writer.differences(settings) == (folder / "bytes.toml", folder / "mode.toml", folder / "missing.toml", folder / "auth.json")


def test_the_digests_of_the_files_are_recorded(tmp_path: Path):
    home = JournalHome(tmp_path)
    writer = ProgramSettingsWriter(home)
    codex_file = SettingsFile(home.program_folder("codex") / "config.toml", "sandbox_mode = \"danger-full-access\"\n")
    writer.write(sample_settings(home))
    writer.write(ProgramSettings("codex", (codex_file,)))
    recorded = json.loads(home.program_settings_digests.read_text())
    assert recorded == {str(home.program_settings_file("claude")): hashlib.sha256(SETTINGS_TEXT.encode()).hexdigest(),
                        str(codex_file.path): hashlib.sha256(codex_file.data).hexdigest()}
    assert writer.recorded_digests() == recorded
    assert mode_of(home.program_settings_digests) == 0o600
