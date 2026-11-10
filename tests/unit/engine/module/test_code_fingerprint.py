import os
from pathlib import Path

from engine.module.code_fingerprint import CodeFingerprint
from engine.module.folder_listing import FolderListing
from engine.module.module import Module


def sample_file(folder, name, text="x = 1\n"):
    path = folder / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


def test_selecting_another_module_in_the_same_folder_changes_the_fingerprint():
    class FirstModule(Module):
        name = "sample.first"

    class SecondModule(Module):
        name = "sample.second"

    fingerprint = CodeFingerprint()
    first = fingerprint.text([FirstModule])
    assert fingerprint.text([FirstModule]) == first
    assert fingerprint.text([FirstModule, FirstModule]) == first
    assert fingerprint.text([SecondModule]) != first
    assert fingerprint.refreshed([FirstModule]) == first
    assert fingerprint.text([FirstModule, SecondModule]) == fingerprint.text([SecondModule, FirstModule])


def test_a_built_window_file_changes_its_modules_version(tmp_path):
    class SampleModule(Module):
        @classmethod
        def folder(cls) -> Path:
            return tmp_path

    built = tmp_path / "web" / "dist"
    built.mkdir(parents=True)
    (built / "agents.js").write_text("old")
    fingerprint = CodeFingerprint()
    first_text = fingerprint.module_text(SampleModule)
    assert fingerprint.module_text(SampleModule) == first_text
    (built / "agents.js").write_text("new window code")
    assert fingerprint.module_text(SampleModule) != first_text


def test_the_text_changes_when_a_file_is_added_changed_moved_or_removed(tmp_path):
    fingerprint = CodeFingerprint()
    first = sample_file(tmp_path, "core/a.py")
    texts = [fingerprint.folder_text([tmp_path])]
    sample_file(tmp_path, "core/b.py")
    texts.append(fingerprint.folder_text([tmp_path]))
    first.write_text("x = 22\n")
    texts.append(fingerprint.folder_text([tmp_path]))
    first.rename(tmp_path / "core" / "c.py")
    texts.append(fingerprint.folder_text([tmp_path]))
    (tmp_path / "core" / "b.py").unlink()
    texts.append(fingerprint.folder_text([tmp_path]))
    assert len(set(texts)) == len(texts)


def test_a_file_that_is_not_python_never_changes_the_text(tmp_path):
    sample_file(tmp_path, "a.py")
    first_text = CodeFingerprint().folder_text([tmp_path])
    sample_file(tmp_path, "notes.txt", "notes")
    assert CodeFingerprint().folder_text([tmp_path]) == first_text


def test_a_missing_folder_or_a_broken_link_gives_a_text_and_never_raises(tmp_path):
    os.symlink(tmp_path / "gone.py", tmp_path / "link.py")
    assert CodeFingerprint().folder_text([tmp_path, tmp_path / "absent"])


def test_a_second_fingerprint_of_the_same_folders_walks_them_no_more_and_a_new_file_is_still_seen(tmp_path):
    (tmp_path / "a.py").write_text("x = 1\n")
    fingerprint = CodeFingerprint()
    first = fingerprint.folder_text([tmp_path])
    listing = FolderListing.kept([tmp_path])
    assert fingerprint.folder_text([tmp_path]) == first
    assert FolderListing.kept([tmp_path]) is listing
    (tmp_path / "b.py").write_text("y = 2\n")
    assert fingerprint.folder_text([tmp_path]) != first
