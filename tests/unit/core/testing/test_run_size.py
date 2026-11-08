from pathlib import Path

from core.testing.run_size import RunSize


def file_of_tests(folder: Path, name: str, tests: int) -> str:
    path = folder / name
    path.write_text("".join(f"def test_{number}():\n    pass\n\n" for number in range(tests)))
    return str(path)


def runners_for(*targets: str) -> int:
    return RunSize(targets, 1000).runner_count(50, 4, 1000, 8)


def test_a_few_tests_run_in_one_runner(tmp_path):
    assert runners_for(file_of_tests(tmp_path, "a.py", 3), file_of_tests(tmp_path, "b.py", 46)) == 1


def test_from_fifty_tests_a_run_starts_four_runners(tmp_path):
    assert runners_for(file_of_tests(tmp_path, "a.py", 50)) == 4
    assert runners_for(file_of_tests(tmp_path, "b.py", 999)) == 4


def test_from_a_thousand_tests_a_run_starts_the_most_runners(tmp_path):
    assert runners_for(file_of_tests(tmp_path, "a.py", 1000)) == 8


def test_a_folder_counts_every_file_below_it(tmp_path):
    (tmp_path / "inner").mkdir()
    file_of_tests(tmp_path, "a.py", 30)
    file_of_tests(tmp_path / "inner", "b.py", 30)
    assert runners_for(str(tmp_path)) == 4


def test_one_named_test_counts_as_one(tmp_path):
    assert runners_for(f"{file_of_tests(tmp_path, 'a.py', 900)}::test_1") == 1


def test_a_run_that_names_nothing_is_the_whole_suite_with_the_most_runners():
    assert RunSize([], 1000).runner_count(50, 4, 1000, 8) == 8
