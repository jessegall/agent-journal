from pathlib import Path

from core.testing.run_size import RunSize


def file_of_tests(folder: Path, name: str, tests: int) -> str:
    path = folder / name
    path.write_text("".join(f"def test_{number}():\n    pass\n\n" for number in range(tests)))
    return str(path)


def test_a_run_of_named_files_under_the_limit_is_small(tmp_path):
    assert RunSize([file_of_tests(tmp_path, "a.py", 3), file_of_tests(tmp_path, "b.py", 4)], 50).is_small()


def test_a_run_at_the_limit_is_not_small(tmp_path):
    assert not RunSize([file_of_tests(tmp_path, "a.py", 50)], 50).is_small()


def test_a_folder_counts_every_file_below_it(tmp_path):
    (tmp_path / "inner").mkdir()
    file_of_tests(tmp_path, "a.py", 30)
    file_of_tests(tmp_path / "inner", "b.py", 30)
    assert not RunSize([str(tmp_path)], 50).is_small()


def test_one_named_test_counts_as_one(tmp_path):
    assert RunSize([f"{file_of_tests(tmp_path, 'a.py', 90)}::test_1"], 50).is_small()


def test_a_run_that_names_nothing_is_the_whole_suite_and_never_small():
    assert not RunSize([], 50).is_small()
