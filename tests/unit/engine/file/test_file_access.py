import os
import stat
from collections import OrderedDict
from pathlib import Path
from unittest.mock import patch

import pytest

import engine.file.file_access as file_module
from engine.file.file_access import FileAccess


# FileAccess keeps one cache for the whole process, so each test starts from an empty one
@pytest.fixture(autouse=True)
def empty_cache(monkeypatch):
    monkeypatch.setattr(FileAccess, "contents", OrderedDict())


def test_text_reads_keep_encoding_errors_and_universal_newlines(tmp_path):
    path = tmp_path / "notes.txt"
    path.write_bytes(b"caf\xe9\r\nnext\rlast\n")
    files = FileAccess()
    assert files.read(path, encoding="latin-1") == "caf\xe9\nnext\nlast\n"
    assert files.read(path, encoding="ascii", errors="replace", newline="") == "caf\ufffd\r\nnext\rlast\n"


def test_binary_writes_invalidate_the_text_and_binary_contents(tmp_path):
    path = tmp_path / "notes.txt"
    files = FileAccess()
    files.write(path, "first")
    assert files.read(path) == "first"
    files.write_binary(path, b"after")
    assert files.binary(path) == b"after"
    assert files.read(path) == "after"


def test_a_streamed_append_invalidates_reads_made_while_its_writer_is_open(tmp_path):
    path = tmp_path / "notes.txt"
    files = FileAccess()
    files.write(path, "first")
    with files.writer(path, "a") as output:
        assert files.read(path) == "first"
        output.write(" after")
    assert files.read(path) == "first after"


def test_touch_preserves_contents_and_can_refuse_an_existing_path(tmp_path):
    path = tmp_path / "notes.txt"
    files = FileAccess()
    files.write(path, "notes")
    files.update_timestamp(path)
    assert files.read(path) == "notes"
    with pytest.raises(FileExistsError):
        files.update_timestamp(path, allow_existing=False)


def test_a_reloaded_file_becomes_recent_before_another_file_is_evicted(tmp_path, monkeypatch):
    monkeypatch.setattr(file_module, "CACHE_SIZE_FILES", 2)
    files = FileAccess()
    first, second, third = (tmp_path / name for name in ("first", "second", "third"))
    for path in (first, second, third):
        path.write_text(path.name)
    files.read(first)
    files.read(second)
    first.write_text("changed elsewhere")
    files.read(first)
    files.read(third)
    with patch.object(Path, "read_bytes", autospec=True, side_effect=Path.read_bytes) as read:
        assert files.read(second) == "second"
    assert read.call_count == 1
    assert len(files.contents) == 2


def test_a_managed_descriptor_preserves_atomic_append_and_invalidates_the_file(tmp_path):
    path = tmp_path / "notes.txt"
    files = FileAccess()
    files.write(path, "first")
    assert files.read(path) == "first"
    with files.descriptor_writer(path, os.O_WRONLY | os.O_APPEND, 0o644) as descriptor:
        os.write(descriptor, b" after")
    assert files.read(path) == "first after"


def test_a_private_writer_creates_a_file_readable_only_by_its_owner(tmp_path):
    path = tmp_path / "secret.txt"
    files = FileAccess()
    with files.private_writer(path) as output:
        output.write("secret")
    assert stat.S_IMODE(path.stat().st_mode) == 0o600
    assert files.read(path) == "secret"


def test_temporary_writer_creates_private_file_and_cleans_it(tmp_path):
    files = FileAccess()
    with files.temporary_writer(tmp_path) as output:
        path = Path(output.name)
        output.write("temporary")
        output.flush()
        assert stat.S_IMODE(path.stat().st_mode) == 0o600
        assert files.read(path) == "temporary"
    assert not path.exists()
