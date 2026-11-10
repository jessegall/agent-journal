import os
import subprocess
import sys
from pathlib import Path

import pytest


@pytest.mark.parametrize("length", [7, 8])
def test_install_refuses_a_file_with_conflict_markers(tmp_path, length):
    project = tmp_path / "project"
    project.mkdir()
    source = tmp_path / "source"
    built_file = source / "core/modules/viewer/web/dist/kit/index-test.js"
    built_file.parent.mkdir(parents=True)
    built_file.write_text("<" * length + " branch\nconst total = 1;\n")
    code = Path(__file__).resolve().parents[2] / "src"
    run = subprocess.run([sys.executable, "-m", "install.update.install_journal", str(project), str(source)],
                         env={**os.environ, "PYTHONPATH": str(code)}, capture_output=True, text=True, timeout=20)
    assert run.returncode == 1
    assert "conflict markers remain in core/modules/viewer/web/dist/kit/index-test.js" in run.stderr
    assert not (project / ".journal/src").exists()
