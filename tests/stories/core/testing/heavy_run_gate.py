import os
import subprocess
import sys
from pathlib import Path
from tests.stories.support.story_checks import expect_value

CHECKOUT = Path(__file__).resolve().parents[4]
GATE_LINE = "holding the gate"
WAITING = "waits in place 1"
GATE_TEST = f"""
import os
import time
from pathlib import Path


def test_hold():
    print("{GATE_LINE}", flush=True)
    while not Path(os.environ["HOLD_RELEASE"]).exists():
        time.sleep(0.05)
"""
QUICK_TEST = """
def test_quick():
    assert True
"""
NICE_TEST = """
import os
from pathlib import Path


def test_first():
    Path(os.environ["NICE_FILE"]).write_text(str(os.nice(0)))


def test_second():
    assert True
"""


def project(tmp_path: Path, name: str, test_name: str, text: str) -> Path:
    folder = tmp_path / name
    (folder / "tests").mkdir(parents=True)
    (folder / "tests" / test_name).write_text(text)
    return folder


def started(tmp_path: Path, folder: Path, *arguments: str, extra: dict[str, str] | None = None) -> subprocess.Popen[str]:
    environment = {key: value for key, value in os.environ.items() if key != "JOURNAL_HEAVY_GATE_HELD"}
    environment.update({"PYTHONPATH": os.pathsep.join([str(CHECKOUT / "src"), str(CHECKOUT)]), "JOURNAL_HEAVY_GATE_FOLDER": str(tmp_path / "gate"),
                        "JOURNAL_FULL_RUN_RECORD": str(tmp_path / "runs.jsonl"), "HOLD_RELEASE": str(tmp_path / "release"), **(extra or {})})
    return subprocess.Popen([sys.executable, "-m", "pytest", "-p", "no:cacheprovider", "-p", "core.testing.pytest_plugin", "-s", "-q", *arguments], cwd=folder, env=environment,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)


def read_line_containing(stream, text: str) -> None:
    for line in stream:
        if text in line:
            return
    raise AssertionError(f"the stream ended before a line with {text!r}")


def holder(tmp_path: Path) -> subprocess.Popen[str]:
    running = started(tmp_path, project(tmp_path, "holder", "test_hold.py", GATE_TEST), "tests")
    read_line_containing(running.stdout, GATE_LINE)
    return running


def release(tmp_path: Path, running: subprocess.Popen[str]) -> None:
    (tmp_path / "release").touch()
    running.communicate(timeout=120)


def test_a_second_full_run_waits_for_the_first(tmp_path):
    first = holder(tmp_path)
    second = started(tmp_path, project(tmp_path, "quick", "test_quick.py", QUICK_TEST), "tests")
    read_line_containing(second.stderr, WAITING)
    expect_value(second.poll() is None, True)
    release(tmp_path, first)
    second_output, _ = second.communicate(timeout=120)
    expect_value(bool(second.returncode == 0 and "1 passed" in second_output), True)


def test_a_single_test_file_does_not_wait(tmp_path):
    first = holder(tmp_path)
    single = started(tmp_path, project(tmp_path, "single", "test_quick.py", QUICK_TEST), "tests/test_quick.py")
    output, _ = single.communicate(timeout=120)
    expect_value(bool(single.returncode == 0 and "1 passed" in output), True)
    expect_value(first.poll() is None, True)
    release(tmp_path, first)


def test_a_dead_holder_frees_the_gate(tmp_path):
    first = holder(tmp_path)
    first.kill()
    first.communicate(timeout=60)
    second = started(tmp_path, project(tmp_path, "quick", "test_quick.py", QUICK_TEST), "tests")
    output, _ = second.communicate(timeout=120)
    expect_value(bool(second.returncode == 0 and "1 passed" in output), True)


def test_runners_start_under_nice(tmp_path):
    nice_file = tmp_path / "nice-value"
    run = started(tmp_path, project(tmp_path, "nice", "test_nice.py", NICE_TEST), "tests", "-n", "2", "-o", "one_runner_below=1", "-o", "runners=2", extra={"NICE_FILE": str(nice_file)})
    output, errors = run.communicate(timeout=300)
    expect_value(run.returncode, 0)
    expect_value(int(nice_file.read_text()) > 0, True)
