from pathlib import Path

from core.testing.run_size import RunSize


def sample_test_file(folder: Path, name: str, tests: int) -> str:
    path = folder / name
    path.write_text("".join(f"def test_{number}():\n    pass\n\n" for number in range(tests)))
    return str(path)


def runner_total(*targets: str) -> int:
    return RunSize(targets, 1000).runner_count(50, 4, 1000, 8)


def test_few_tests_use_single_runner(tmp_path):
    assert runner_total(sample_test_file(tmp_path, "a.py", 3), sample_test_file(tmp_path, "b.py", 46)) == 1


def test_fifty_tests_start_four_runners(tmp_path):
    assert runner_total(sample_test_file(tmp_path, "a.py", 50)) == 4
    assert runner_total(sample_test_file(tmp_path, "b.py", 999)) == 4


def test_thousand_tests_start_highest_runner_count(tmp_path):
    assert runner_total(sample_test_file(tmp_path, "a.py", 1000)) == 8


def test_folder_counts_nested_files(tmp_path):
    (tmp_path / "inner").mkdir()
    sample_test_file(tmp_path, "a.py", 30)
    sample_test_file(tmp_path / "inner", "b.py", 30)
    assert runner_total(str(tmp_path)) == 4


def test_node_id_counts_single(tmp_path):
    assert runner_total(f"{sample_test_file(tmp_path, 'a.py', 900)}::test_1") == 1


def test_empty_targets_use_highest_runner_count():
    assert RunSize([], 1000).runner_count(50, 4, 1000, 8) == 8
