from pathlib import Path

from core.testing.run_size import RunSize


def sample_test_file(folder: Path, name: str, tests: int) -> str:
    path = folder / name
    path.write_text("".join(f"def test_{number}():\n    pass\n\n" for number in range(tests)))
    return str(path)


def test_small_run_uses_single_runner(tmp_path):
    assert RunSize([sample_test_file(tmp_path, "a.py", 3), sample_test_file(tmp_path, "b.py", 4)], 1000).runner_count(250, 4) == 1
    assert RunSize([sample_test_file(tmp_path, "c.py", 250)], 1000).runner_count(250, 4) == 1


def test_each_block_adds_runner(tmp_path):
    assert RunSize([sample_test_file(tmp_path, "a.py", 251)], 1000).runner_count(250, 4) == 2
    assert RunSize([sample_test_file(tmp_path, "b.py", 700)], 1000).runner_count(250, 4) == 3
    assert RunSize([sample_test_file(tmp_path, "c.py", 2000)], 1000).runner_count(250, 4) == 4


def test_folder_counts_nested_files(tmp_path):
    (tmp_path / "inner").mkdir()
    sample_test_file(tmp_path, "a.py", 200)
    sample_test_file(tmp_path / "inner", "b.py", 200)
    assert RunSize([str(tmp_path)], 1000).runner_count(250, 4) == 2


def test_node_id_counts_single(tmp_path):
    assert RunSize([f"{sample_test_file(tmp_path, 'a.py', 900)}::test_1"], 1000).runner_count(250, 4) == 1


def test_empty_targets_use_highest_runner_count():
    assert RunSize([], 1000).runner_count(250, 4) == 4
