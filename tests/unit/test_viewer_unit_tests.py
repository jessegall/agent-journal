import shutil
import subprocess
from pathlib import Path

import pytest

VIEWER = Path(__file__).resolve().parents[2] / "src" / "viewer"
RUN_LIMIT_SECONDS = 300


@pytest.mark.viewer_job
def test_the_viewers_unit_tests_pass():
    finished = subprocess.run([str(shutil.which("npm")), "test", "--", "--run", "--reporter=dot"], cwd=VIEWER, capture_output=True, text=True, timeout=RUN_LIMIT_SECONDS, check=False)
    assert finished.returncode == 0, (finished.stdout + finished.stderr)[-3000:]
