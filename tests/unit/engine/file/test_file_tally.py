from engine.file.file_access import FileAccess
from engine.file.file_tally import FileTally


def test_a_walk_counts_every_entry_it_lists(tmp_path):
    for name in ("a", "b", "c"):
        (tmp_path / name).write_text(name)
    with FileTally.counting() as counts:
        list(FileAccess.walk(tmp_path))
    assert counts["listed entry"] == 3


def test_checks_and_reads_are_counted_apart(tmp_path):
    file = tmp_path / "note.txt"
    file.write_text("hello")
    with FileTally.counting() as counts:
        FileAccess.exists(file)
        FileAccess.read(file)
    assert counts["read"] == 1 and counts["check"] >= 2


def test_nothing_is_counted_outside_a_tally(tmp_path):
    FileAccess.exists(tmp_path)
    with FileTally.counting() as counts:
        pass
    assert sum(counts.values()) == 0
