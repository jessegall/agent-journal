import json
from pathlib import Path
import shutil
import subprocess

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULE = "architecture_core_product_file_named_like_a_test"
SAMPLES = CUSTOM / "samples" / "src" / "shop"
SAMPLE_FILES = ("test_grant.py", "test_limits.py", "environment_grant.py")


def test_the_detector_exists_is_registered_and_its_samples_exist():
    declared = json.loads((CUSTOM / f"{RULE}.json").read_text())
    assert declared["engine"] == "python" and declared["find"]["select"] == "kind:Module"
    assert RULE in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    assert all((SAMPLES / name).is_file() for name in SAMPLE_FILES)


def test_the_detector_fires_on_a_source_file_named_test_and_stays_silent_on_a_plain_name(tmp_path):
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": [RULE]}))
    shutil.copyfile(CUSTOM / f"{RULE}.json", custom / f"{RULE}.json")
    shutil.copytree(SAMPLES, custom / "samples" / "src" / "shop")
    shutil.copytree(CUSTOM / "skills" / "plain-code-words", custom / "skills" / "plain-code-words")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    assert f"✓ {RULE}" in completed_process.stdout, completed_process.stdout
