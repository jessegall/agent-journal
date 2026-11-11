import getpass
import os
import subprocess
import sys
from pathlib import Path

from engine.testing.templates.temp_folders import FAILED_PREFIX, KEPT_FAILED_RUNS, PYTEST_PREFIX, RUNNING_FOLDER_SECONDS, RUNNING_PREFIX, TempFolders
from engine.testing.cache.template_cache import TemplateCache

CHECK = Path(__file__).resolve().parents[5] / "scripts" / "checks" / "pytest_folder_size.py"


def user_folder(root: Path) -> Path:
    return root / f"pytest-of-{getpass.getuser()}"


def filled(folder: Path, size: int) -> Path:
    folder.mkdir(parents=True)
    (folder / "data").write_bytes(b"x" * size)
    return folder


def test_a_passed_run_removes_its_folder(tmp_path):
    folders = TempFolders(tmp_path)
    run = folders.start()
    (run / "data").write_text("x")

    folders.finish(run, passed=True)

    assert list(tmp_path.iterdir()) == []


def test_a_failed_run_keeps_its_folder_under_a_failed_name(tmp_path):
    folders = TempFolders(tmp_path)
    run = folders.start()

    folders.finish(run, passed=False)

    assert [folder.name for folder in tmp_path.iterdir()] == [FAILED_PREFIX + run.name.removeprefix(RUNNING_PREFIX)]


def test_only_the_newest_failed_runs_are_kept(tmp_path):
    names = [f"{FAILED_PREFIX}2026010{number}T000000-1" for number in range(1, KEPT_FAILED_RUNS + 3)]
    for name in names:
        filled(tmp_path / name, 1)

    TempFolders(tmp_path).remove_old()

    assert sorted(folder.name for folder in tmp_path.iterdir()) == names[-KEPT_FAILED_RUNS:]


def test_a_run_still_going_is_left_and_an_old_leftover_is_removed(tmp_path):
    active = filled(tmp_path / f"{RUNNING_PREFIX}20260101T000000-1", 1)
    leftover = filled(tmp_path / f"{PYTEST_PREFIX}7", 1)
    old = os.stat(leftover).st_mtime - RUNNING_FOLDER_SECONDS - 1
    os.utime(leftover, (old, old))

    TempFolders(tmp_path).remove_old()

    assert active.is_dir() and not leftover.exists()


def run_check(root: Path, limit: int) -> subprocess.CompletedProcess:
    environment = {**os.environ, "PYTEST_DEBUG_TEMPROOT": str(root)}
    return subprocess.run([sys.executable, str(CHECK), str(limit)], env=environment, capture_output=True, text=True, timeout=30)


def test_the_size_check_fails_over_the_limit_and_passes_under_it(tmp_path):
    filled(user_folder(tmp_path) / "pytest-1", 100)

    assert run_check(tmp_path, 1000).returncode == 0
    assert run_check(tmp_path, 99).returncode == 1


def test_the_template_cache_removes_the_least_recently_used_folder_over_its_limit(tmp_path):
    cache = TemplateCache(tmp_path, limit_bytes=150)
    older = filled(tmp_path / "older", 100)
    newer = filled(tmp_path / "newer", 100)
    os.utime(older, (1, 1))

    cache.drop_oldest_templates()

    assert not older.exists() and newer.is_dir()


def run_pytest_with_plugin(root: Path, test_source: str, *options: str) -> subprocess.CompletedProcess:
    tests = root / "sample"
    tests.mkdir(exist_ok=True)
    (tests / "test_sample.py").write_text(test_source)
    (root / "pytest.ini").write_text("[pytest]\n")
    environment = {**os.environ, "PYTEST_DEBUG_TEMPROOT": str(root / "temp"), "PYTHONPATH": os.pathsep.join(sys.path)}
    return subprocess.run([sys.executable, "-m", "pytest", "-p", "engine.testing.stories.pytest_plugin", "-p", "no:cacheprovider", "-c", str(root / "pytest.ini"), str(tests), *options],
                          cwd=root, env=environment, capture_output=True, text=True, timeout=60)


def kept_folders(root: Path) -> list[str]:
    return [folder.name.split("-")[0] for folder in user_folder(root / "temp").iterdir()]


def test_a_passing_run_leaves_no_folder_and_a_failing_run_leaves_one(tmp_path):
    passing = "def test_writes(tmp_path):\n    (tmp_path / 'file').write_text('x')\n"

    run_pytest_with_plugin(tmp_path, passing)
    assert kept_folders(tmp_path) == []

    run_pytest_with_plugin(tmp_path, passing + "\ndef test_fails():\n    assert False\n")
    assert kept_folders(tmp_path) == ["failed"]


def test_a_run_with_workers_removes_its_folder_when_it_passes(tmp_path):
    source = "".join(f"def test_{number}(tmp_path):\n    (tmp_path / 'file').write_text('x')\n" for number in range(4))

    run_pytest_with_plugin(tmp_path, source, "-n", "2", "-o", "shard_limit_tests=1")

    assert kept_folders(tmp_path) == []


def test_a_new_run_removes_the_folder_of_a_run_whose_process_has_ended_and_keeps_one_still_going(tmp_path):
    ended = filled(tmp_path / f"{RUNNING_PREFIX}20260101T000000-99999999", 1)
    active = filled(tmp_path / f"{RUNNING_PREFIX}20260101T000000-{os.getpid()}", 1)

    TempFolders(tmp_path).start()

    assert not ended.exists() and active.is_dir()


def test_a_new_run_keeps_only_the_newest_failed_runs(tmp_path):
    names = [f"{FAILED_PREFIX}2026010{number}T000000-1" for number in range(1, KEPT_FAILED_RUNS + 3)]
    for name in names:
        filled(tmp_path / name, 1)

    TempFolders(tmp_path).start()

    assert sorted(folder.name for folder in tmp_path.iterdir() if folder.name.startswith(FAILED_PREFIX)) == names[-KEPT_FAILED_RUNS:]


def test_a_story_folder_is_removed_when_its_test_passes_and_kept_when_it_fails(tmp_path):
    source = "def test_passes(new_story):\n    new_story()\n\n\ndef test_fails(new_story):\n    new_story()\n    assert False\n"

    run_pytest_with_plugin(tmp_path, source)

    failed = next(user_folder(tmp_path / "temp").iterdir())
    assert not (failed / "test_passes0" / "journal").exists()
    assert (failed / "test_fails0" / "journal").is_dir()


def test_the_template_cache_drops_folders_unused_for_a_day_but_never_the_one_in_use(tmp_path):
    cache = TemplateCache(tmp_path, limit_bytes=1000)
    old = filled(tmp_path / "old", 1)
    recent = filled(tmp_path / "recent", 1)
    current = filled(tmp_path / "current", 1)
    yesterday = os.stat(old).st_mtime - 24 * 3600 - 1
    os.utime(old, (yesterday, yesterday))
    os.utime(current, (yesterday, yesterday))

    cache.drop_expired(current)

    assert not old.exists() and recent.is_dir() and current.is_dir()
