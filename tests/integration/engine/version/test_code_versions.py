from engine.time.clock import Clock
from pathlib import Path

import pytest

from engine.errors.code_version_missing_error import CodeVersionMissingError
from engine.version.code_versions import FIRST_VERSION, CodeVersions
from engine.journal.journal_home import JournalHome


def source(folder: Path, text: str) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    (folder / "code.py").write_text(text)
    return folder


@pytest.fixture
def versions(tmp_path: Path) -> CodeVersions:
    (tmp_path / "home").mkdir()
    return CodeVersions(JournalHome(tmp_path / "home"))


def test_a_version_is_added_beside_the_running_one_and_leaves_its_files_alone_until_the_switch(versions, tmp_path):
    versions.switch(versions.add(source(tmp_path / "one", "first code"), Clock()))
    running = (versions.link / "code.py").resolve()
    tag = versions.add(source(tmp_path / "two", "second code"), Clock())
    assert running.read_text() == "first code"
    assert (versions.link / "code.py").read_text() == "first code"
    versions.switch(tag)
    assert running.read_text() == "first code"
    assert (versions.link / "code.py").read_text() == "second code"


def test_a_real_src_folder_is_kept_as_the_first_version_when_the_link_replaces_it(versions, tmp_path):
    source(versions.link, "installed code")
    versions.switch(versions.add(source(tmp_path / "one", "new code"), Clock()))
    assert versions.link.is_symlink()
    assert (versions.link / "code.py").read_text() == "new code"
    assert (versions.version(FIRST_VERSION) / "code.py").read_text() == "installed code"


def test_a_switch_to_a_version_with_no_folder_moves_nothing(versions):
    source(versions.link, "installed code")
    with pytest.raises(CodeVersionMissingError):
        versions.switch("0000")
    assert not versions.link.is_symlink()
    assert (versions.link / "code.py").read_text() == "installed code"


def test_changed_code_makes_a_version_of_its_own_and_the_same_code_shares_one(versions, tmp_path):
    folder = source(tmp_path / "work", "first code")
    tag = versions.add(folder, Clock())
    assert versions.add(folder, Clock()) == tag
    source(folder, "second code")
    changed = versions.add(folder, Clock())
    assert changed != tag
    assert (versions.version(tag) / "code.py").read_text() == "first code"
    assert (versions.version(changed) / "code.py").read_text() == "second code"


def test_ignored_files_are_no_part_of_a_version(versions, tmp_path):
    folder = source(tmp_path / "work", "code")
    tag = versions.tag(folder)
    (folder / "__pycache__").mkdir()
    (folder / "__pycache__" / "code.pyc").write_text("cache")
    assert versions.tag(folder) == tag


def test_a_copy_that_stopped_halfway_is_written_again_and_is_never_a_version(versions, tmp_path):
    folder = source(tmp_path / "work", "whole")
    tag = versions.tag(folder)
    source(versions.version(f"{tag}.partial"), "half")
    (versions.version(f"{tag}.partial") / "stale.py").write_text("half")
    versions.add(folder, Clock())
    assert sorted(path.name for path in versions.version(tag).iterdir()) == ["code.py"]
    assert not versions.version(f"{tag}.partial").exists()


def test_the_switch_keeps_the_running_version_and_the_one_it_replaced_from_copies_of_one_folder(versions, tmp_path):
    folder = tmp_path / "work"
    for text in ("one", "two", "three"):
        versions.switch(versions.add(source(folder, text), Clock()))
    replaced = versions.link.resolve().name
    versions.switch(versions.add(source(folder, "four"), Clock()))
    assert {path.name for path in versions.folder.iterdir() if path.is_dir()} == {replaced, versions.link.resolve().name}


def test_the_prune_leaves_a_copy_in_progress_and_stray_files_alone(versions, tmp_path):
    versions.folder.mkdir()
    source(versions.version("1234.partial"), "half")
    (versions.folder / "notes.txt").write_text("a file")
    versions.switch(versions.add(source(tmp_path / "one", "code"), Clock()))
    assert versions.version("1234.partial").is_dir()
    assert (versions.folder / "notes.txt").is_file()


def test_an_install_on_a_link_adds_a_version_and_never_writes_into_the_running_one(versions, tmp_path):
    versions.switch(versions.add(source(tmp_path / "one", "first code"), Clock()))
    running = (versions.link / "code.py").resolve()
    versions.install(source(tmp_path / "two", "second code"), Clock())
    assert running.read_text() == "first code"
    assert (versions.link / "code.py").read_text() == "second code"


def test_an_install_on_a_real_folder_stays_a_copy(versions, tmp_path):
    source(versions.link, "installed code")
    versions.install(source(tmp_path / "one", "new code"), Clock())
    assert not versions.link.is_symlink()
    assert (versions.link / "code.py").read_text() == "new code"
