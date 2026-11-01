import os

from core.base.module.code_fingerprint import CodeFingerprint


def sample_file(folder, name, text="x = 1\n"):
    path = folder / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    return path


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
    listing = fingerprint.listings[(tmp_path,)]
    assert fingerprint.folder_text([tmp_path]) == first
    assert fingerprint.listings[(tmp_path,)] is listing
    (tmp_path / "b.py").write_text("y = 2\n")
    assert fingerprint.folder_text([tmp_path]) != first
