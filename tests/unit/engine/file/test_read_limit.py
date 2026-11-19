import pytest

from engine.errors.file_too_large_error import FileTooLargeError
from engine.file.file_access import FileAccess


def test_a_whole_read_past_its_limit_is_refused_and_one_within_it_reads(tmp_path):
    path = tmp_path / "large.txt"
    path.write_text("x" * 100)

    with pytest.raises(FileTooLargeError):
        FileAccess.read(path, limit_bytes=99)
    with pytest.raises(FileTooLargeError):
        FileAccess.current(path, limit_bytes=99)

    assert FileAccess.read(path, limit_bytes=100) == "x" * 100
    assert FileAccess.bytes_range(path, 90, 50) == b"x" * 10
