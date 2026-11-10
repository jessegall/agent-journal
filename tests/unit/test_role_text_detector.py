import json
import shutil
import subprocess
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
CUSTOM = ROOT / ".commandments" / "custom"
RULE = "architecture_drivers_text_names_two_roles"
SAMPLE = "nudges/two_roles.py"


def test_the_detector_exists_is_enrolled_and_names_the_calls_it_reads():
    declared = json.loads((CUSTOM / f"{RULE}.json").read_text())
    names = declared["find"]["where"][0]["nameIn"]
    assert declared["engine"] == "python" and names == ["Refusal", "NudgeDeclaration"]
    assert RULE in json.loads((CUSTOM.parent / "config.json").read_text())["detectors"]
    assert (CUSTOM / "skills" / declared["sin"]["skill"]).is_dir()
    assert (CUSTOM / "samples" / SAMPLE).is_file()


def test_the_detector_fires_on_a_text_for_two_roles_and_stays_silent_on_a_text_for_one(tmp_path):
    custom = tmp_path / ".commandments" / "custom"
    (custom / "samples").mkdir(parents=True)
    (custom.parent / "config.json").write_text(json.dumps({"detectors": [RULE]}))
    shutil.copyfile(CUSTOM / f"{RULE}.json", custom / f"{RULE}.json")
    shutil.copytree(CUSTOM / "skills" / "drivers-architecture", custom / "skills" / "drivers-architecture")
    shutil.copyfile(CUSTOM / "samples" / SAMPLE, custom / "samples" / "two_roles.py")
    plugin = Path(".journal/plugins/code-commandments/bin/commandments-release")
    executable = next((str(folder / plugin) for folder in (ROOT, *ROOT.parents) if (folder / plugin).is_file()), None)
    if executable is None:
        pytest.skip("the code-commandments plugin is not installed")
    completed_process = subprocess.run([executable, "rule", "prove"], cwd=tmp_path, capture_output=True, text=True, timeout=30)
    assert completed_process.returncode == 0, completed_process.stdout + completed_process.stderr
    assert f"✓ {RULE}" in completed_process.stdout, completed_process.stdout
