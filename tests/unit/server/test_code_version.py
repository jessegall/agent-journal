from collections.abc import Sequence
from pathlib import Path

from core.base.journal_home import JournalHome
from core.base.module.code_fingerprint import CodeFingerprint
from core.base.module.module_finder import ModuleFinder
from server.code_version import CodeVersion
from server.code_folders import CodeFolders


class SampleFolders(CodeFolders):
    def __init__(self, sample_folders: Sequence[Path]) -> None:
        self.sample_folders = sample_folders

    def folders(self) -> Sequence[Path]:
        return self.sample_folders


def test_the_version_is_current_until_a_file_in_its_folders_changes(tmp_path):
    core_file, server_file = tmp_path / "core" / "a.py", tmp_path / "server" / "b.py"
    for path in (core_file, server_file):
        path.parent.mkdir()
        path.write_text("x = 1\n")
    version = CodeVersion(CodeFingerprint(), SampleFolders([core_file.parent, server_file.parent]))
    assert not version.is_stale()
    server_file.write_text("x = 22\n")
    assert version.is_stale()


def test_the_real_folders_hold_the_core_every_module_and_the_server():
    folders = [path.name for path in CodeFolders(ModuleFinder(JournalHome(Path("/nonexistent")))).folders()]
    assert folders[0] == "core" and folders[-1] == "server" and "tasks" in folders


def test_a_change_is_seen_only_after_the_recheck_time(tmp_path):
    source = tmp_path / "a.py"
    source.write_text("x = 1\n")
    version = CodeVersion(CodeFingerprint(), SampleFolders([tmp_path]), recheck_seconds=3600)
    source.write_text("x = 22\n")
    assert not version.is_stale()
    version.checked_seconds -= 3600
    assert version.is_stale()
