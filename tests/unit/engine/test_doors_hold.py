import os
import re
import subprocess
from pathlib import Path

import pytest

CHECKOUT = Path(__file__).resolve().parents[3]
JUDGED_FILES = re.compile(r"No sins found in (\d+) files")
LEAST_JUDGED_FILES = 1000
JUDGE_LIMIT_SECONDS = 600
WAIT_SAMPLE = """import subprocess
import threading
import time


def waits(condition: threading.Condition, thread: threading.Thread, child: subprocess.Popen) -> None:
    time.sleep(1)
    condition.wait(1)
    thread.join(1)
    child.wait(1)
    child.communicate()
"""
WAIT_SAMPLE_LINES = (7, 8, 9, 10, 11)
FILE_SAMPLE = """import os
import shutil
import tempfile
from pathlib import Path


def touches(path: Path) -> None:
    path.read_text()
    path.exists()
    open(path)
    os.listdir(path)
    shutil.rmtree(path)
    tempfile.mkdtemp()
    path.mkdir()
    path.unlink()
"""
FILE_SAMPLE_LINES = (8, 9, 10, 11, 12, 13, 14, 15)
RULES = {"wait-outside-the-wait-doors": (WAIT_SAMPLE, WAIT_SAMPLE_LINES), "file-system-outside-file-access": (FILE_SAMPLE, FILE_SAMPLE_LINES)}


# the plugin lives in the project's own .journal, which a worker's worktree shares through git's common folder
def judge_program() -> Path:
    common = subprocess.run(["git", "rev-parse", "--path-format=absolute", "--git-common-dir"], cwd=CHECKOUT, capture_output=True, text=True, check=True)
    program = Path(common.stdout.strip()).parent / ".journal" / "plugins" / "code-commandments" / "bin" / "commandments-release"
    assert program.is_file(), f"the code-commandments judge is missing at {program}, so the doors are not checked"
    return program


def judged(sin: str, folder: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run([str(judge_program()), "judge", f"--sin={sin}", "--no-checklist", str(folder)], cwd=CHECKOUT, capture_output=True, text=True,
                          env={**os.environ, "COMMANDMENTS_QUEUED": "1"}, timeout=JUDGE_LIMIT_SECONDS)


@pytest.mark.parametrize("sin", sorted(RULES))
def test_the_rule_finds_nothing_in_the_journals_code_and_judged_it_all(sin: str):
    result = judged(sin, CHECKOUT / "src")
    output = result.stdout + result.stderr
    judged_count = JUDGED_FILES.search(output)
    assert result.returncode == 0 and judged_count is not None, f"{sin} found something or could not run (exit {result.returncode}):\n{output}"
    assert int(judged_count.group(1)) >= LEAST_JUDGED_FILES, f"{sin} judged only {judged_count.group(1)} files:\n{output}"


@pytest.mark.parametrize("sin", sorted(RULES))
def test_the_rule_catches_every_kind_it_names(sin: str, tmp_path: Path):
    sample, lines = RULES[sin]
    sample_file = tmp_path / "src" / "engine" / "sample.py"
    sample_file.parent.mkdir(parents=True)
    sample_file.write_text(sample)
    result = judged(sin, tmp_path)
    output = result.stdout + result.stderr
    caught = {int(line) for line in re.findall(r"sample\.py:(\d+)", output)}
    assert result.returncode == 1 and caught == set(lines), f"{sin} caught lines {sorted(caught)}, not {list(lines)} (exit {result.returncode}):\n{output}"
