import os
from pathlib import Path

import pytest

from core.base.code_versions import FIRST_VERSION, CodeVersions
from core.base.journal_home import JournalHome


def source(folder: Path, text: str) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "code.py").write_text(text)
    return folder


@pytest.fixture
def versions(tmp_path: Path) -> CodeVersions:
    (tmp_path / "home").mkdir()
    return CodeVersions(JournalHome(tmp_path / "home"))


def test_a_version_is_added_beside_the_running_one_and_leaves_its_files_alone_until_the_switch(versions, tmp_path):
    versions.add(source(tmp_path / "one", "first code"), "1")
    versions.switch("1")
    running = (versions.link / "code.py").resolve()
    versions.add(source(tmp_path / "two", "second code"), "2")
    assert running.read_text() == "first code"
    assert (versions.link / "code.py").read_text() == "first code"
    versions.switch("2")
    assert running.read_text() == "first code"
    assert (versions.link / "code.py").read_text() == "second code"


def test_a_real_src_folder_is_kept_as_the_first_version_when_the_link_replaces_it(versions, tmp_path):
    source(versions.link, "installed code")
    versions.add(source(tmp_path / "one", "new code"), "1")
    versions.switch("1")
    assert versions.link.is_symlink()
    assert (versions.link / "code.py").read_text() == "new code"
    assert (versions.version(FIRST_VERSION) / "code.py").read_text() == "installed code"


def test_a_version_already_added_is_not_copied_a_second_time(versions, tmp_path):
    versions.add(source(tmp_path / "one", "first code"), "1")
    versions.add(source(tmp_path / "two", "second code"), "1")
    assert (versions.version("1") / "code.py").read_text() == "first code"


def test_a_copy_that_stopped_halfway_is_written_again_and_is_never_a_version(versions, tmp_path):
    source(versions.version("1.partial"), "half")
    (versions.version("1.partial") / "stale.py").write_text("half")
    versions.add(source(tmp_path / "one", "whole"), "1")
    assert sorted(path.name for path in versions.version("1").iterdir()) == ["code.py"]
    assert not versions.version("1.partial").exists()


def test_the_switch_keeps_the_running_version_and_the_one_before_it(versions, tmp_path):
    for age, tag in enumerate(("1", "2", "3")):
        versions.add(source(tmp_path / tag, tag), tag)
        os.utime(versions.version(tag), (age, age))
        versions.switch(tag)
    source(versions.version("4.partial"), "half")
    versions.switch("3")
    assert sorted(path.name for path in versions.folder.iterdir()) == ["2", "3"]
