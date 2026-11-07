from pathlib import Path

from core.testing.run_size import RunSize


def file_of_tests(folder: Path, name: str, tests: int) -> str:
    path = folder / name
    path.write_text("".join(f"def test_{number}():\n    pass\n\n" for number in range(tests)))
    return str(path)


def test_up_to_one_block_of_tests_runs_in_one_runner(tmp_path):
    assert RunSize([file_of_tests(tmp_path, "a.py", 3), file_of_tests(tmp_path, "b.py", 4)], 1000).workers(250, 4) == 1
    assert RunSize([file_of_tests(tmp_path, "c.py", 250)], 1000).workers(250, 4) == 1


def test_each_started_block_adds_a_runner_up_to_the_most(tmp_path):
    assert RunSize([file_of_tests(tmp_path, "a.py", 251)], 1000).workers(250, 4) == 2
    assert RunSize([file_of_tests(tmp_path, "b.py", 700)], 1000).workers(250, 4) == 3
    assert RunSize([file_of_tests(tmp_path, "c.py", 2000)], 1000).workers(250, 4) == 4


def test_a_folder_counts_every_file_below_it(tmp_path):
    (tmp_path / "inner").mkdir()
    file_of_tests(tmp_path, "a.py", 200)
    file_of_tests(tmp_path / "inner", "b.py", 200)
    assert RunSize([str(tmp_path)], 1000).workers(250, 4) == 2


def test_one_named_test_counts_as_one(tmp_path):
    assert RunSize([f"{file_of_tests(tmp_path, 'a.py', 900)}::test_1"], 1000).workers(250, 4) == 1


def test_a_run_that_names_nothing_is_the_whole_suite_with_the_most_runners():
    assert RunSize([], 1000).workers(250, 4) == 4
